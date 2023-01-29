/**
 * @file ws.router.ts
 * @author Mark Hutchison
 * Router dedicated to handling websocket interactions.
 */
import { SocketStream } from "@fastify/websocket";
import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyRequest,
} from "fastify";
import jwt, { Secret } from "jsonwebtoken";

import { WebsocketType } from "../../shared/enums/WebsocketTypes";
import {
  WebsocketRequest,
  WebsocketResponse,
} from "../../shared/types/Websocket";
import {
  ErrorData,
  GameJoinAckData,
  NextPlayerData,
} from "../../shared/apis/WebSocketAPIType";

import Game from "../models/Game";
import User, { UserType } from "../models/User";

import {
  nextPlayer,
  startGame,
  turn,
  questionAnswer,
  handleConsequence,
  checkWinner,
} from "../controllers/GameController";
import { Player } from "../../shared/types/Player";

// Create Record to match WS to GameID
type ClientConn = {
  username: string;
  conn: SocketStream;
};

let connections: Record<
  string,
  {
    host: ClientConn;
    clients: Array<ClientConn>;
    turn?: {
      turn_start: number;
      timeout?: NodeJS.Timeout;
      movement_die: number;
    };
  }
> = {};

/**
 * The handling function for the websocket router.
 * It receives a request and various parameters, and handles it appropriately.
 * @param {FastifyInstance} fastify - The root fastify instance that the router is attaching itself to.
 * @param {Record} opts - Configuration options relevant to only this specific sub-router.
 * @param done - Function that indicates the end of definitions.
 */
const WSRouter: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.get(
    "/:gameID",
    { websocket: true },
    async (conn: SocketStream, req: FastifyRequest) => {
      // Set WebSocket Encoding
      conn.setEncoding("utf8");

      // Get params and data
      const { gameID } = req.params as { gameID: string };

      /*
      | Message:
      * 1. Validate connection via JWT
      * 2. Handle message via switch
      */
      conn.socket.on("message", (stream) => {
        // Validate data stream contains required information about user
        const data = JSON.parse(stream.toString()) as WebsocketRequest;
        // Verify user JWT and handle logic
        jwt.verify(
          data.token,
          process.env.ACCESS_TOKEN_SECRET! as Secret,
          async (err: any, token: any) => {
            const validatedToken = tryValidateToken(conn, err, token, gameID, data);
            if (!validatedToken) {
              return;
            }
            const { username, userType, gameCode } = validatedToken;

            try {
              const game = await tryGetGame(stream, gameID, gameCode, token, data, userType);

              if (!game) {
                return; // TODO Mark, since this is inside a try catch, we don't need to handle the errors in tryGetGame. Just throw and handle below
              }

              await handleMessage(stream, data, game, token, username, gameID, gameCode, userType);

            } catch(err) {
              conn.socket.send(
                JSON.stringify({
                  type: WebsocketType.Error,
                  requestId: data.requestId,
                  data: {
                    error: err,
                    message: `[WS] error occurred while fetching game with code ${gameCode}.`,
                    token: token,
                    fatal: true,
                  } as ErrorData,
                } as WebsocketResponse)
              );
              return;
            }
          }
        );
      });

      /*
      | Disconnect:
      * 1. Find client within the connections record and remove them from the connections array
      */
      conn.socket.on("close", async (stream) => {
        await handleDisconnect(stream, gameID);
      });
    }
  );
  done();
};

/**
 * Tries to validate the JWT token and handles sending error messages
 * @param conn the socket stream that is used for the data transmission
 * @param err error object passed from JWT
 * @param token the token to validate
 * @param gameID the id of the game 
 * @param data the payload of the request
 * @returns true if the validation succedded. False otherwise
 */
function tryValidateToken(conn: SocketStream, err: any, token: any, gameID: string, data: any): any | null {
  if (err || token === undefined) {
    console.log(`[WS] Validation Error: ${err}`);
    if (err instanceof Error) {
      conn.socket.send(
        JSON.stringify({
          type: WebsocketType.Error,
          requestId: data.requestId,
          data: { 
            error: err.message, 
            token: token,
            fatal: true,
          } as ErrorData,
        } as WebsocketResponse)
      );
    } else {
      conn.socket.send(
        JSON.stringify({
          type: WebsocketType.Error,
          requestId: data.requestId,
          data: {
            error: "[WS] Token sent is undefined.",
            token: token,
            fatal: true,
          } as ErrorData,
        } as WebsocketResponse)
      );
    }
    conn.end();
    return null;
  }
  // Decompose JWT token
  const { username, userType, gameCode } = token;
  // Validate that the gameID and gameCode from the token match
  if (gameCode !== gameID) {
    sendError(conn, data, token, `[WS] Game ID and JWT mismatch. You requested game with ID ${gameID} but have a JWT for game ${gameCode}.`, null, true);
    conn.end();
    return null;
  }

  return token;
}

/**
 * Tries to extract the data data from the database and sends error messages as needed
 * @param conn the connection over which the data is send
 * @param gameID 
 * @param gameCode 
 * @param token 
 * @param data 
 * @param userType 
 * @returns the current game state
 */
// TODO: Mark, what is the difference between gameCode and gameId?
async function tryGetGame(conn: SocketStream, gameID: string, gameCode: string, token: any, data: any, userType: string): Promise<any> {
  const game = await Game.findOne({ game_code: gameCode })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .exec();

  if (!game) {
    sendError(conn, data, token, `[WS] No game found with id ${gameCode}.`, null, true);
    return null;
  }

  console.log(`[WS] Populated Game information: ${game.hostId} | ${game.players}`);

  // Find all user data related to the game
  const user =
    userType === "Game"
      ? game.hostId
      : game.players.find((u) => u.token === data.token);

  // Respond that user is not a part of the game or doesn't exist.
  if (
    !user ||
    (userType === "Game" && game.hostId.token !== data.token)
  ) {
    sendError(conn, data, token, `[WS] User is not a part of game ${gameID}.`, null, true);
    return null;
  }
  return game;
}

/**
 * Handles the disconnection of nodes by ending the game
 * @param conn 
 * @param gameID 
 * @returns 
 */
async function handleDisconnect(conn: SocketStream, gameID: string) {
  if (!connections[gameID]) {
    // User never sent message and was never assigned to game
    sendError(conn, null, "", "[WS] This connection was never associated with a game.", null, true);
    return;
  }
  const game = await Game.findOne({ game_code: gameID })
    .populate<{ players: UserType[] }>("players")
    .orFail()
    .exec();
  // Check if close was host or clients
  if (connections[gameID].host.conn === conn) {
    // Get rankings
    const ranking: Player[] = game!.players.map((p) => {
      return {
        username: p.username,
        color: p.color,
        position: p.position,
      } as Player;
    });
    // If Host, disconnect all clients and send message
    connections[gameID].host.conn.socket.send(
      JSON.stringify({
        type: WebsocketType.GameEndedAck,
        requestId: undefined,
        data: {
          ranking: ranking,
        },
      } as WebsocketResponse)
    );
    connections[gameID].clients.forEach((c) => {
      c.conn.socket.send(
        JSON.stringify({
          type: WebsocketType.GameEndedAck,
          requestId: undefined,
          data: {
            ranking: ranking,
          },
        } as WebsocketResponse)
      );
      c.conn.end();
    });
    delete connections[gameID];
    // Delete database items
    await User.findOneAndDelete(game!.hostId);
    game!.players.forEach(async (p) => {
      await User.findOneAndDelete({
        username: p.username,
        userType: "Client",
        game: game!._id,
      });
    });
    conn.end();
  } else {
    // If Client, just DC and alert everyone else
    // Get username of player who left
    let dis_username = connections[gameID].clients.find(
      (c) => c.conn === conn
    )!.username;
    connections[gameID].clients = connections[gameID].clients.filter(
      (c) => c.conn !== conn
    );
    connections[gameID].host.conn.socket.send(
      JSON.stringify({
        type: WebsocketType.PlayerDisconnectAck,
        requestId: undefined,
        data: {
          username: dis_username,
        },
      } as WebsocketResponse)
    );
    connections[gameID].clients.forEach((c) => {
      c.conn.socket.send(
        JSON.stringify({
          type: WebsocketType.PlayerDisconnectAck,
          requestId: undefined,
          data: {
            username: dis_username,
          },
        } as WebsocketResponse)
      );
    });
    game.players = game.players.filter(
      (p) => p.username !== dis_username
    );
    await game.save();
    // Delete user
    await User.findOneAndDelete({
      username: dis_username,
      userType: "Client",
      game: game._id,
    });
    conn.end();
  }
}

function gameSetupRequest(conn: SocketStream, token: any, userType: string, gameID: string, username: string, data: any, game: any) {
  if (userType === "Game" && !connections[gameID]) {
    // Create spot in the connections array for players
    connections[gameID] = {
      host: { username: username, conn: conn },
      clients: [],
    };
    conn.socket.send(
      JSON.stringify({
        type: WebsocketType.GameJoinAck,
        requestId: data.requestId,
        data: {
          players: game.players.map((u) => {
            return {
              username: u.username,
              color: u.color,
              position: u.position,
            };
          }),
        } as GameJoinAckData,
      } as WebsocketResponse)
    );
  } else if (userType !== "Game") {
    sendError(conn, data, token, `[WS] Only the game node can set-up a game.`, null, true);
  } else {
    sendError(conn, data, token, `[WS] A user has already connected to this game as the host.`, null, false);
  }
}

function gameJoinRequest(conn: SocketStream, token: any, userType: string, gameID: string, username: string, data: any, game: any) {
  if (userType !== 'Client') {
    sendError(conn, data, token, `[WS] Game nodes cannot connect as players.`, null, false);
    return;
  }

  if (connections[gameID]) {
    // Add connection socket to array
    connections[gameID].clients.push({
      username: username,
      conn: conn,
    });
    // Ping all players in game that player has joined
    connections[gameID].host.conn.socket.send(
      JSON.stringify({
        type: WebsocketType.GameJoinAck,
        requestId: data.requestId,
        data: {
          players: game.players.map((u) => {
            return {
              username: u.username,
              color: u.color,
              position: u.position,
            };
          }),
        } as GameJoinAckData,
      } as WebsocketResponse)
    );
    connections[gameID].clients.forEach((c) => {
      c.conn.socket.send(
        JSON.stringify({
          type: WebsocketType.GameJoinAck,
          requestId: data.requestId,
          data: {
            players: game.players.map((u) => {
              return {
                username: u.username,
                color: u.color,
                position: u.position,
              };
            }),
          } as GameJoinAckData,
        } as WebsocketResponse)
      );
    });
  } else {
    sendError(conn, data, token, `[WS] The host has not yet connected to the game. Please try again later.`, null, false);
  }
}

async function gameStartRequest(conn: SocketStream, token: any, gameID: string, gameCode: string, data: any, game: any) {
  try {
    const first_player = await startGame(gameCode)
    // Notify all players that the game has started and who the first player is
    const player = game.players.find(
      (u) => u.username === first_player
    );
    connections[gameID].host.conn.socket.send(
      JSON.stringify({
        type: WebsocketType.GameStartAck,
        requestId: data.requestId,
        data: {
          player: {
            username: player!.username,
            color: player!.color,
            position: player!.position,
          },
        } as NextPlayerData,
      } as WebsocketResponse)
    );
    connections[gameID].clients.forEach((c) => {
      c.conn.socket.send(
        JSON.stringify({
          type: WebsocketType.GameStartAck,
          requestId: data.requestId,
          data: {
            player: {
              username: player!.username,
              color: player!.color,
              position: player!.position,
            },
          } as NextPlayerData,
        } as WebsocketResponse)
      );
    });

    setTimeout(async () => {
      try {
        await turn(connections[gameID], data, game)

      } catch(err) {
        conn.socket.send(
          JSON.stringify({
            type: WebsocketType.Error,
            requestId: data.requestId,
            data: {
              error: err,
              message: "[WS] Turn has failed.",
              token: token,
              fatal: true,
            } as ErrorData,
          } as WebsocketResponse)
        );
      }
    }, 5 * 1000);
  } catch(err) {
    conn.socket.send(
      JSON.stringify({
        type: WebsocketType.Error,
        requestId: data.requestId,
        data: {
          error: err,
          token: token,
          fatal: true,
        } as ErrorData,
      } as WebsocketResponse)
    );
  }
}

async function gameNextPlayerRequest(conn: SocketStream, token: any, gameID: string, gameCode: string, data: any, game: any) {
  try {
    const res = await nextPlayer(gameCode);
      // Notify all players that the game has started and who the next player is
      const player = game.players.find(
        (u) => u.username === res
      );
      connections[gameID].host.conn.socket.send(
        JSON.stringify({
          type: WebsocketType.NextPlayerAck,
          requestId: data.requestId,
          data: {
            player: {
              username: player!.username,
              color: player!.color,
              position: player!.position,
            },
          } as NextPlayerData,
        } as WebsocketResponse)
      );
      connections[gameID].clients.forEach((c) => {
        c.conn.socket.send(
          JSON.stringify({
            type: WebsocketType.NextPlayerAck,
            requestId: data.requestId,
            data: {
              player: {
                username: player!.username,
                color: player!.color,
                position: player!.position,
              },
            } as NextPlayerData,
          } as WebsocketResponse)
        );
      });
      setTimeout(async () => {
        // Check if there is a winner
        try {
          const winner = await checkWinner(gameID)
          if (winner === false) {
            // No winner, continue game
            turn(connections[gameID], data, game)
              .then((res) => {})
              .catch((err) => {
                conn.socket.send(
                  JSON.stringify({
                    type: WebsocketType.Error,
                    requestId: data.requestId,
                    data: {
                      error: err,
                      message: "[WS] Turn has failed.",
                      token: token,
                      fatal: true,
                    } as ErrorData,
                  } as WebsocketResponse)
                );
              });
          } else {
            // Winner
            const ranking: Player[] = game!.players.map(
              (p) => {
                return {
                  username: p.username,
                  color: p.color,
                  position: p.position,
                } as Player;
              }
            );
            // If Host, disconnect all clients and send message
            connections[gameID].host.conn.socket.send(
              JSON.stringify({
                type: WebsocketType.GameEndedAck,
                requestId: undefined,
                data: {
                  ranking: ranking,
                },
              } as WebsocketResponse)
            );
            connections[gameID].clients.forEach((c) => {
              c.conn.socket.send(
                JSON.stringify({
                  type: WebsocketType.GameEndedAck,
                  requestId: undefined,
                  data: {
                    ranking: ranking,
                  },
                } as WebsocketResponse)
              );
            });
          }
        } catch(err) {
          conn.socket.send(
            JSON.stringify({
              type: WebsocketType.Error,
              requestId: data.requestId,
              data: {
                error: err,
                message: `[WS] error occurred while checking winner of ${gameCode}.`,
                token: token,
                fatal: true,
              } as ErrorData,
            } as WebsocketResponse)
          );
        }
      }, 5 * 1000);
    } catch(err) {
      conn.socket.send(
        JSON.stringify({
          type: WebsocketType.Error,
          requestId: data.requestId,
          data: {
            error: err,
            message: `[WS] error occurred while fetching next player for ${gameCode}.`,
            token: token,
            fatal: true,
          } as ErrorData,
        } as WebsocketResponse)
      );
    }
}

async function gameQuestionRequest(conn: SocketStream, token: any, gameID: string, userType: string, data: any, game: any) {
  if (!checkUserAuthorization(userType, "Game", conn, data, token)) {
    return;
  }
  await tryTurnAction(conn, data, token, 
    async() => {
      const _ = await turn(connections[gameID], data, game)
    }
  );
}

async function gameQuestionAnswer(conn: SocketStream, token: any, gameID: string, userType: string, data: any, game: any) {
  if (!checkUserAuthorization(userType, "Game", conn, data, token)) {
    return;
  }
  let conn_username = connections[gameID].clients.find(
    (c) => c.conn === conn
  )!.username;
  
  tryTurnAction(conn, data, token, async () => {
    const correct = await questionAnswer(
      connections[gameID],
      data,
      conn_username,
      game
    )
    console.log(
      `[WS] User ${conn_username} has gotten the answer ${correct}.`
    );
  });
}

async function gameConsequenceEnded(conn: SocketStream, token: any, gameID: string, userType: string, data: any, game: any) {
  if (!checkUserAuthorization(userType, "Client", conn, data, token)) {
    return;
  }
  let conn_username = connections[gameID].clients.find( // TODO APPARENTLY THE RESULT OF THIS IS NOT USED. DO WE NEED IT?
    (c) => c.conn === conn
  )!.username;
  await tryTurnAction(conn, data, token, () => handleConsequence(
    connections[gameID],
    game,
    data,
    true
  ));
}

// TODO: Mark, what is the difference between gameCode and gameId?
// ALSO, if you use classes, not only will testing (less shim-ing) be easier but all we could store the connection and other parameters as class-level globals
async function handleMessage(conn: SocketStream, data: any, game: any, token: any, username: string, gameID: string, gameCode: string, userType: string) {
  switch (data.type) {
    case WebsocketType.GameSetup: {
      gameSetupRequest(conn, token, userType, gameID, username, data, game);
      break;
    }
    case WebsocketType.GameJoin: {
      gameJoinRequest(conn, token, userType, gameID, username, data, game);
      break;
    }
    case WebsocketType.GameStart: {
      await gameStartRequest(conn, token, gameID, gameCode, data, game);
      break;
    }
    case WebsocketType.NextPlayer: {
      await gameNextPlayerRequest(conn, token, gameID, gameCode, data, game);
      break;
    }
    case WebsocketType.QuestionRequest: {
      await gameQuestionRequest(conn, token, gameID, userType, data, game);
      break;
    }
    case WebsocketType.QuestionAnswer: {
      await gameQuestionAnswer(conn, token, gameID, userType, data, game);
      break;
    }
    case WebsocketType.ConsequenceEnded: {
      await gameConsequenceEnded(conn, token, gameID, userType, data, game);
      break;
    }
    case WebsocketType.Ping:
    default: {
      // Handle Pong Response
      conn.socket.send(
        JSON.stringify({
          type: WebsocketType.Pong,
          requestId: data.requestId,
          data: {
            message: "[WS] Pong!",
          },
        } as WebsocketResponse)
      );
      break;
    }
  }
}

function checkUserAuthorization(userType: string, goalUserType: string, conn: SocketStream, data: any, token: any): boolean {
  if (userType !== goalUserType) {
    sendError(conn, data, token, "[WS] User not authorized.", null, true);
    return false;
  }
  return true;
}

async function tryTurnAction(conn: SocketStream, data: any, token: any, action: () => Promise<void>) {
  try {
    await action();
  } catch(err) {
    sendError(conn, data, token, err, "[WS] Turn has failed.", true);
  }
}

function sendError(conn: SocketStream, data: any, token: any, err: any, message: string | null, fatal: boolean) {
  conn.socket.send(
    JSON.stringify({
      type: WebsocketType.Error,
      requestId: data.requestId ?? "",
      data: {
        error: err,
        message: message,
        token: token ?? "",
        fatal: fatal,
      } as ErrorData,
    } as WebsocketResponse)
  );
}

export default WSRouter;
