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
  WebSocketError,
  GameJoinAckData,
  NextPlayerData,
  WebSocketPong,
  GameEndAckData,
  PlayerDisconnectAckData,
} from "../../shared/apis/WebSocketAPIType";
import { nextPlayer, startGame } from "../controllers/GameController";
import User from "../models/User";

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
 * @param {FastifyInstance} fastify The root fastify instance that the router is attaching itself to.
 * @param {Record} opts Configuration options relevant to only this specific sub-router.
 * @param done Function that indicates the end of definitions.
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
        const data = JSON.parse(stream.toString()) as WebsocketRequest<any>;
        // Verify user JWT
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
                  } as WebsocketResponse<WebSocketError>)
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
                  } as WebsocketResponse<WebSocketError>)
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
                    token: token
                  },
                } as WebsocketResponse<WebSocketError>)
              );
              conn.end();
              return;
            }

            // Fetch User from Database for relevant information
            User.findOne({
              username: username,
              userType: userType,
              gameCode: gameCode,
            })
              .exec()
              .then((user) => {
                if (!user) {
                  conn.socket.send(
                    JSON.stringify({
                      type: WebsocketType.Error,
                      requestId: data.requestId,
                      data: {
                        error: "[WS] No user found with this information in the database.",
                        token: token
                      },
                    } as WebsocketResponse<WebSocketError>)
                  );
                  return;
                }
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
                            username: username,
                            players: connections[gameID].clients.map(
                              (c) => c.username
                            ),
                            color: user!.color,
                            position: user!.position,
                          },
                        } as WebsocketResponse<GameJoinAckData>)
                      );
                    } else if (userType !== "Game") {
                      conn.socket.send(
                        JSON.stringify({
                          type: WebsocketType.Error,
                          requestId: data.requestId,
                          data: {
                            error: `[WS] Only the game node can set-up a game.`,
                            token: token
                          },
                        } as WebsocketResponse<WebSocketError>)
                      );
                    } else {
                      conn.socket.send(
                        JSON.stringify({
                          type: WebsocketType.Error,
                          requestId: data.requestId,
                          data: {
                            error: `[WS] A user has already connected to this game as the host.`,
                            token: token
                          },
                        } as WebsocketResponse<WebSocketError>)
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
                            username: username,
                            players: connections[gameID].clients.map(
                              (c) => c.username
                            ),
                            color: user!.color,
                            position: user!.position,
                          }
                        } as WebsocketResponse<GameJoinAckData>)
                      );
                      connections[gameID].clients.forEach((c) => {
                        c.conn.socket.send(
                          JSON.stringify({
                            type: WebsocketType.GameJoinAck,
                            requestId: data.requestId,
                            data: {
                              username: username,
                              color: user!.color,
                              position: user!.position,
                            }
                          } as WebsocketResponse<GameJoinAckData>)
                        );
                      });
                    } else if (userType !== "Client") {
                      conn.socket.send(
                        JSON.stringify({
                          type: WebsocketType.Error,
                          requestId: data.requestId,
                          data: {
                            error: `[WS] Game nodes cannot connect as players.`,
                            token: token
                          },
                        } as WebsocketResponse<WebSocketError>)
                      );
                    } else {
                      conn.socket.send(
                        JSON.stringify({
                          type: WebsocketType.Error,
                          requestId: data.requestId,
                          data: {
                            error: `[WS] The host has not yet connected to the game. Please try again later.`,
                            token: token
                          },
                        } as WebsocketResponse<WebSocketError>)
                      );
                    }
                    break;
                  }
                  case WebsocketType.GameStart: {
                    startGame(gameCode)
                      .then((first_player) => {
                        // Notify all players that the game has started and who the first player is
                        connections[gameID].host.conn.socket.send(
                          JSON.stringify({
                            type: WebsocketType.GameStartAck,
                            requestId: data.requestId,
                            data: {
                              username: first_player,
                              players: connections[gameID].clients.map(
                                (c) => c.username
                              ),
                            },
                          } as WebsocketResponse<NextPlayerData>)
                        );
                        connections[gameID].clients.forEach((c) => {
                          c.conn.socket.send(
                            JSON.stringify({
                              type: WebsocketType.GameStartAck,
                              requestId: data.requestId,
                              data: {
                                username: first_player,
                              },
                            } as WebsocketResponse<NextPlayerData>)
                          );
                        });
                      })
                      .catch((err) => {
                        conn.socket.send(
                          JSON.stringify({
                            type: WebsocketType.Error,
                            requestId: data.requestId,
                            data: {
                              error: `[WS] Error while starting the game: ${err}`,
                              token: token,
                            },
                          } as WebsocketResponse<WebSocketError>)
                        );
                      });
                    break;
                  }
                  case WebsocketType.NextPlayer: {
                    nextPlayer(gameCode, data.data.current_player)
                      .then((next_player) => {
                        // Notify all players that the game has started and who the first player is
                        connections[gameID].host.conn.socket.send(
                          JSON.stringify({
                            type: WebsocketType.NextPlayerAck,
                            requestId: data.requestId,
                            data: {
                              username: next_player,
                            }
                          } as WebsocketResponse<NextPlayerData>)
                        );
                        connections[gameID].clients.forEach((c) => {
                          c.conn.socket.send(
                            JSON.stringify({
                              type: WebsocketType.NextPlayerAck,
                              requestId: data.requestId,
                              data: {
                                username: next_player,
                              }
                            } as WebsocketResponse<NextPlayerData>)
                          );
                        });
                      })
                      .catch((err) => {
                        conn.socket.send(
                          JSON.stringify({
                            type: WebsocketType.Error,
                            requestId: data.requestId,
                            data: {
                              error: `[WS] Error while starting the game: ${err}`,
                              token: token,
                            },
                          } as WebsocketResponse<WebSocketError>)
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
                      } as WebsocketResponse<WebSocketPong>)
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
                      error: `[WS] Error while connecting to websocket. ${err}`,
                      token: token,
                    },
                  } as WebsocketResponse<WebSocketError>)
                );
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
                token: ""
              },
            } as WebsocketResponse<WebSocketError>)
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
                ranking: [] // todo
              }
            } as WebsocketResponse<GameEndAckData>)
          );
          connections[gameID].clients.forEach((c) => {
            c.conn.socket.send(
              JSON.stringify({
                type: WebsocketType.GameEndedAck,
                requestId: undefined,
                data: {
                  ranking: [] // todo
                }
              } as WebsocketResponse<GameEndAckData>)
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
            } as WebsocketResponse<PlayerDisconnectAckData)
          );
          connections[gameID].clients.forEach((c) => {
            c.conn.socket.send(
              JSON.stringify({
                type: WebsocketType.PlayerDisconnectAck,
                requestId: undefined,
                data: {
                  username: c.username,
                },
              } as WebsocketResponse<PlayerDisconnectAckData)
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
