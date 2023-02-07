/**
 * @file ws.router.ts
 * @author Mark Hutchison
 * Router dedicated to handling websocket interactions.
 */
import { SocketStream } from "@fastify/websocket";
import { FastifyPluginCallback, FastifyRequest } from "fastify";
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

import { Connections } from "../controllers/WebSocketController";
import {
  nextPlayer,
  startGame,
  turn,
  questionAnswer,
  handleConsequence,
  checkWinner,
} from "../controllers/GameController";
import { Context } from "../../shared/types/Context";
import { Player } from "../../shared/types/Player";

// Create Record to match WS to GameID
let connections: Connections = {};

/**
 * The handling function for the websocket router.
 * It receives a request and various parameters, and handles it appropriately.
 * @param fastify - The root fastify instance that the router is attaching itself to.
 * @param opts - Configuration options relevant to only this specific sub-router.
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
              sendError(
                conn,
                data,
                token,
                `[WS] Game ID and JWT mismatch. You requested game with ID ${gameID} but have a JWT for game ${gameCode}.`,
                null,
                true
              );
              conn.end();
              return null;
            }

            // Create context for passing
            const context: Context = {
              username: username,
              userType: userType,
              token: token,
              gameID: gameID,
            };

            try {
              const game = tryGetGame(conn, data, context);
              await handleMessage(conn, data, context);
            } catch (err) {
              conn.socket.send(
                JSON.stringify({
                  type: WebsocketType.Error,
                  requestId: data.requestId,
                  data: {
                    error: err,
                    message: `[WS] error occurred while fetching game with code ${gameID}.`,
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
        await handleDisconnect(conn, gameID);
      });
    }
  );
  done();
};

async function tryGetGame(
  conn: SocketStream,
  data: any,
  context: Context
): Promise<any> {
  const game = await Game.findOne({ game_code: context.gameID })
    .populate<{ hostId: UserType }>("hostId")
    .populate<{ players: UserType[] }>("players")
    .orFail()
    .exec();

  // console.log(`[WS] Populated Game information: ${game.hostId} | ${game.players}`);

  // Find all user data related to the game
  const user =
    context.userType === "Game"
      ? game.hostId
      : game.players.find((u) => u.token === data.token);

  // Respond that user is not a part of the game or doesn't exist.
  if (
    !user ||
    (context.userType === "Game" && game.hostId.token !== data.token)
  ) {
    sendError(
      conn,
      data,
      context,
      `[WS] User is not a part of game ${context.gameID}.`,
      null,
      true
    );
    return null;
  }
  return game;
}

async function handleDisconnect(conn: SocketStream, gameID: string) {
  if (!connections[gameID]) {
    // User never sent message and was never assigned to game
    sendError(
      conn,
      null,
      { username: "", userType: "", token: "", gameID: "" } as Context,
      "[WS] This connection was never associated with a game.",
      null,
      true
    );
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
    game.players = game.players.filter((p) => p.username !== dis_username);
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

async function gameSetupRequest(
  conn: SocketStream,
  data: any,
  context: Context
) {
  if (context.userType === "Game" && !connections[context.gameID]) {
    const game = await Game.findOne({ game_code: context.gameID })
      .populate<{ hostId: UserType }>("hostId")
      .populate<{ players: UserType[] }>("players")
      .orFail()
      .exec();
    // Create spot in the connections array for players
    connections[context.gameID] = {
      host: { username: context.username, conn: conn },
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
  } else if (context.userType !== "Game") {
    sendError(
      conn,
      data,
      context,
      `[WS] Only the game node can set-up a game.`,
      null,
      true
    );
  } else {
    sendError(
      conn,
      data,
      context,
      `[WS] A user has already connected to this game as the host.`,
      null,
      false
    );
  }
}

async function gameJoinRequest(
  conn: SocketStream,
  data: any,
  context: Context
) {
  if (context.userType !== "Client") {
    sendError(
      conn,
      data,
      context,
      `[WS] Game nodes cannot connect as players.`,
      null,
      false
    );
    return;
  }

  if (connections[context.gameID]) {
    const game = await Game.findOne({ game_code: context.gameID })
      .populate<{ hostId: UserType }>("hostId")
      .populate<{ players: UserType[] }>("players")
      .orFail()
      .exec();
    // Add connection socket to array
    connections[context.gameID].clients.push({
      username: context.username,
      conn: conn,
    });
    // Ping all players in game that player has joined
    connections[context.gameID].host.conn.socket.send(
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
    connections[context.gameID].clients.forEach((c) => {
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
    sendError(
      conn,
      data,
      context,
      `[WS] The host has not yet connected to the game. Please try again later.`,
      null,
      false
    );
  }
}

async function gameStartRequest(
  conn: SocketStream,
  data: any,
  context: Context
) {
  try {
    const game = await Game.findOne({ game_code: context.gameID })
      .populate<{ hostId: UserType }>("hostId")
      .populate<{ players: UserType[] }>("players")
      .orFail()
      .exec();
    const first_player = await startGame(context.gameID);
    // Notify all players that the game has started and who the first player is
    const player = game.players.find((u) => u.username === first_player);
    connections[context.gameID].host.conn.socket.send(
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
    connections[context.gameID].clients.forEach((c) => {
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
        const turn_data = await turn(
          connections[context.gameID],
          data,
          context
        );
        console.log(`[WS] Turn didn't error: ${turn_data}`);
      } catch (err) {
        console.log(`[WS] gameStartRequest inner try failed.`);
        conn.socket.send(
          JSON.stringify({
            type: WebsocketType.Error,
            requestId: data.requestId,
            data: {
              error: err,
              message: "[WS] Turn, from gameStartRequest, has failed.",
              token: context.token,
              fatal: true,
            } as ErrorData,
          } as WebsocketResponse)
        );
      }
    }, 5 * 1000);
  } catch (err) {
    console.log(`[WS] gameStartRequest outer try failed.`);
    conn.socket.send(
      JSON.stringify({
        type: WebsocketType.Error,
        requestId: data.requestId,
        data: {
          error: err,
          token: context.token,
          fatal: true,
        } as ErrorData,
      } as WebsocketResponse)
    );
  }
}

async function gameNextPlayerRequest(
  conn: SocketStream,
  data: any,
  context: Context
) {
  try {
    const game = await Game.findOne({ game_code: context.gameID })
      .populate<{ hostId: UserType }>("hostId")
      .populate<{ players: UserType[] }>("players")
      .orFail()
      .exec();
    const res = await nextPlayer(context.gameID);
    // Notify all players that the game has started and who the next player is
    const player = game.players.find((u) => u.username === res);
    connections[context.gameID].host.conn.socket.send(
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
    connections[context.gameID].clients.forEach((c) => {
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
        const winner = await checkWinner(context.gameID);
        if (winner === false) {
          // No winner, continue game
          await turn(connections[context.gameID], data, context);
        } else {
          // Winner
          const ranking: Player[] = game!.players.map((p) => {
            return {
              username: p.username,
              color: p.color,
              position: p.position,
            } as Player;
          });
          // If Host, disconnect all clients and send message
          connections[context.gameID].host.conn.socket.send(
            JSON.stringify({
              type: WebsocketType.GameEndedAck,
              requestId: undefined,
              data: {
                ranking: ranking,
              },
            } as WebsocketResponse)
          );
          connections[context.gameID].clients.forEach((c) => {
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
      } catch (err) {
        conn.socket.send(
          JSON.stringify({
            type: WebsocketType.Error,
            requestId: data.requestId,
            data: {
              error: err,
              message: `[WS] error occurred while checking winner of ${context.gameID}.`,
              token: context.token,
              fatal: true,
            } as ErrorData,
          } as WebsocketResponse)
        );
      }
    }, 5 * 1000);
  } catch (err) {
    conn.socket.send(
      JSON.stringify({
        type: WebsocketType.Error,
        requestId: data.requestId,
        data: {
          error: err,
          message: `[WS] error occurred while fetching next player for ${context.gameID}.`,
          token: context.token,
          fatal: true,
        } as ErrorData,
      } as WebsocketResponse)
    );
  }
}

async function gameQuestionRequest(
  conn: SocketStream,
  data: any,
  context: Context
) {
  if (!checkUserAuthorization(conn, data, context, "Game"))
    throw "[WS] User is not an authorized Game.";
  await tryTurnAction(conn, data, context, async () => {
    const _ = await turn(connections[context.gameID], data, context);
  });
}

async function gameQuestionAnswer(
  conn: SocketStream,
  data: any,
  context: Context
) {
  if (!checkUserAuthorization(conn, data, context, "Client"))
    throw "[WS] User is not an authorized Client.";
  tryTurnAction(conn, data, context, async () => {
    const correct = await questionAnswer(
      connections[context.gameID],
      data,
      context
    );
    console.log(
      `[WS] User ${context.username} has gotten the answer ${correct}.`
    );
  });
}

async function gameConsequenceEnded(
  conn: SocketStream,
  data: any,
  context: Context
) {
  if (!checkUserAuthorization(conn, data, context, "Client"))
    throw "[WS] User is not an authorized Client.";
  await tryTurnAction(conn, data, context, () =>
    handleConsequence(connections[context.gameID], data, context, true)
  );
}

async function handleMessage(conn: SocketStream, data: any, context: Context) {
  switch (data.type) {
    case WebsocketType.GameSetup: {
      gameSetupRequest(conn, data, context);
      break;
    }
    case WebsocketType.GameJoin: {
      gameJoinRequest(conn, data, context);
      break;
    }
    case WebsocketType.GameStart: {
      await gameStartRequest(conn, data, context);
      break;
    }
    case WebsocketType.NextPlayer: {
      await gameNextPlayerRequest(conn, data, context);
      break;
    }
    case WebsocketType.QuestionRequest: {
      await gameQuestionRequest(conn, data, context);
      break;
    }
    case WebsocketType.QuestionAnswer: {
      await gameQuestionAnswer(conn, data, context);
      break;
    }
    case WebsocketType.ConsequenceEnded: {
      await gameConsequenceEnded(conn, data, context);
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

function checkUserAuthorization(
  conn: SocketStream,
  data: any,
  context: Context,
  goalUserType: string
): boolean {
  if (context.userType !== goalUserType) {
    sendError(
      conn,
      data,
      context,
      `[WS] User not authorized. Expected ${goalUserType}, got ${context.userType}.`,
      null,
      true
    );
    return false;
  }
  return true;
}

async function tryTurnAction(
  conn: SocketStream,
  data: any,
  context: Context,
  action: () => Promise<boolean | void>
) {
  try {
    const res = await action();
    return res;
  } catch (err) {
    sendError(
      conn,
      data,
      context,
      err,
      "[WS] Turn, from tryTurnAction, has failed.",
      true
    );
  }
}

function sendError(
  conn: SocketStream,
  data: any,
  context: Context,
  err: any,
  message: string | null,
  fatal: boolean
) {
  conn.socket.send(
    JSON.stringify({
      type: WebsocketType.Error,
      requestId: data.requestId ?? "",
      data: {
        error: err,
        message: message,
        token: context.token ?? "",
        fatal: fatal,
      } as ErrorData,
    } as WebsocketResponse)
  );
}

export default WSRouter;
