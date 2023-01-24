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
  ConnectionEstablished,
  GameJoinAckData,
  NextPlayerData,
} from "../../shared/apis/WebSocketAPIType";
import { nextPlayer, startGame } from "../controllers/GameController";
import Game, { GameType } from "../models/Game";
import User, { UserType } from "../models/User";

// Create Record to match WS to GameID
type GameID = string;
type ClientConn = {
  username: string;
  conn: SocketStream;
};
let connections: Record<
  GameID,
  {
    host: ClientConn;
    clients: Array<ClientConn>;
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
    (conn: SocketStream, req: FastifyRequest) => {
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
          (err: any, token: any) => {
            if (err || token === undefined) {
              console.log(`[WS] Validation Error: ${err}`);
              if (err instanceof Error) {
                conn.socket.send(
                  JSON.stringify({
                    type: WebsocketType.Error,
                    requestId: data.requestId,
                    data: { error: err, token: token },
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
                    },
                  } as WebsocketResponse)
                );
              }
              conn.end();
              return;
            }
            // Decompose JWT token
            const { username, userType, gameCode } = token;
            // Validate that the gameID and gameCode from the token match
            if (gameCode !== gameID) {
              conn.socket.send(
                JSON.stringify({
                  type: WebsocketType.Error,
                  requestId: data.requestId,
                  data: {
                    error: `[WS] Game ID and JWT mismatch. You requested game with ID ${gameID} but have a JWT for game ${gameCode}.`,
                    token: token,
                  },
                } as WebsocketResponse)
              );
              conn.end();
              return;
            }

            // Fetch the game id to find players
            Game.findOne({ game_code: gameCode })
              .populate<{ hostId: GameType }>("hostId")
              .populate<{ players: UserType[] }>("players")
              .exec()
              .then((game) => {
                if (!game) {
                  conn.socket.send(
                    JSON.stringify({
                      type: WebsocketType.Error,
                      requestId: data.requestId,
                      data: {
                        error: `[WS] No game found with id ${gameCode}.`,
                        token: token,
                      },
                    } as WebsocketResponse)
                  );
                  return;
                }

                console.log(
                  `[WS] Populated Game information: ${game.hostId} | ${game.players}`
                );
                // Find all user data related to the game
                const user =
                  userType === "Game"
                    ? game.hostId
                    : game.players.find((u) => u.token === token);
                const player_list = game.players;

                // Handle message
                switch (data.type) {
                  case WebsocketType.GameSetup: {
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
                            players: player_list.map((u) => {
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
                      conn.socket.send(
                        JSON.stringify({
                          type: WebsocketType.Error,
                          requestId: data.requestId,
                          data: {
                            error: `[WS] Only the game node can set-up a game.`,
                            token: token,
                          },
                        } as WebsocketResponse)
                      );
                    } else {
                      conn.socket.send(
                        JSON.stringify({
                          type: WebsocketType.Error,
                          requestId: data.requestId,
                          data: {
                            error: `[WS] A user has already connected to this game as the host.`,
                            token: token,
                          },
                        } as WebsocketResponse)
                      );
                    }
                    break;
                  }
                  case WebsocketType.GameJoin: {
                    if (userType === "Client" && connections[gameID]) {
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
                            players: player_list.map((u) => {
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
                              players: player_list.map((u) => {
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
                    } else if (userType !== "Client") {
                      conn.socket.send(
                        JSON.stringify({
                          type: WebsocketType.Error,
                          requestId: data.requestId,
                          data: {
                            error: `[WS] Game nodes cannot connect as players.`,
                            token: token,
                          },
                        } as WebsocketResponse)
                      );
                    } else {
                      conn.socket.send(
                        JSON.stringify({
                          type: WebsocketType.Error,
                          requestId: data.requestId,
                          data: {
                            error: `[WS] The host has not yet connected to the game. Please try again later.`,
                            token: token,
                          },
                        } as WebsocketResponse)
                      );
                    }
                    break;
                  }
                  case WebsocketType.GameStart: {
                    startGame(gameCode)
                      .then((first_player) => {
                        // Notify all players that the game has started and who the first player is
                        const player = player_list.find(
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
                      })
                      .catch((err) => {
                        conn.socket.send(
                          JSON.stringify({
                            type: WebsocketType.Error,
                            requestId: data.requestId,
                            data: {
                              error: err,
                              token: token,
                            },
                          } as WebsocketResponse)
                        );
                      });
                    break;
                  }
                  case WebsocketType.NextPlayer: {
                    nextPlayer(gameCode, data.data.current_player)
                      .then((next_player) => {
                        // Notify all players that the game has started and who the next player is
                        const player = player_list.find(
                          (u) => u.username === next_player
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
                      })
                      .catch((err) => {
                        conn.socket.send(
                          JSON.stringify({
                            type: WebsocketType.Error,
                            requestId: data.requestId,
                            data: {
                              error: err,
                              token: token,
                            },
                          } as WebsocketResponse)
                        );
                      });
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
              })
              .catch((err) => {
                conn.socket.send(
                  JSON.stringify({
                    type: WebsocketType.Error,
                    requestId: data.requestId,
                    data: {
                      error: `[WS] error occured while fetching game with code ${gameCode}.${JSON.stringify(
                        err
                      )}`,
                      token: token,
                    },
                  } as WebsocketResponse)
                );
                return;
              });
          }
        );
      });

      /*
      | Disconnect:
      * 1. Find client within the connections record and remove them from the connections array
      */
      conn.socket.on("close", (stream) => {
        if (!connections[gameID]) {
          // User never sent message and was never assigned to game
          conn.socket.send(
            JSON.stringify({
              type: WebsocketType.Error,
              requestId: undefined,
              data: {
                error: "[WS] This connection was never associated with a game.",
              },
            } as WebsocketResponse)
          );
          return;
        }
        // Check if close was host or clients
        if (connections[gameID].host.conn === conn) {
          // If Host, disconnect all clients and send message
          connections[gameID].host.conn.socket.send(
            JSON.stringify({
              type: WebsocketType.GameEndedAck,
              requestId: undefined,
              data: {
                ranking: [], // todo
              },
            } as WebsocketResponse)
          );
          connections[gameID].clients.forEach((c) => {
            c.conn.socket.send(
              JSON.stringify({
                type: WebsocketType.GameEndedAck,
                requestId: undefined,
                data: {
                  ranking: [], // todo
                },
              } as WebsocketResponse)
            );
            c.conn.end();
          });
          delete connections[gameID];
          conn.end();
        } else {
          // If Client, just DC and alert everyone else
          connections[gameID].host.conn.socket.send(
            JSON.stringify({
              type: WebsocketType.PlayerDisconnectAck,
              requestId: undefined,
              data: {
                username: connections[gameID].host.username,
              },
            } as WebsocketResponse)
          );
          connections[gameID].clients.forEach((c) => {
            c.conn.socket.send(
              JSON.stringify({
                type: WebsocketType.PlayerDisconnectAck,
                requestId: undefined,
                data: {
                  username: c.username,
                },
              } as WebsocketResponse)
            );
          });
          connections[gameID].clients = connections[gameID].clients.filter(
            (c) => c.conn !== conn
          );
          conn.end();
        }
      });
    }
  );
  done();
};

export default WSRouter;
