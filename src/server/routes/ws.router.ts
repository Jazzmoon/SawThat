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
        const data = JSON.parse(stream.toString()) as WebsocketRequest;
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
                    data: { error: err, token: token },
                  } as WebsocketResponse)
                );
              } else {
                conn.socket.send(
                  JSON.stringify({
                    type: WebsocketType.Error,
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
                  data: {
                    message: "[WS] Game ID and JWT mismatch.",
                    data: `You requested game with ID ${gameID} but have a JWT for game ${gameCode}.`,
                  },
                } as WebsocketResponse)
              );
              conn.end();
              return;
            }
            // Send confirmation to current socket that they have joined:
            conn.socket.send(
              JSON.stringify({
                type: WebsocketType.GameJoinAck,
                data: {
                  message: `[WS] Game with ID ${gameID} joined successfully.`,
                  username: username,
                  userType: userType,
                  gameCode: gameCode,
                  JWT: token,
                },
              } as WebsocketResponse)
            );
            // Send message to everyone in game to confirm user has joined:
            connections[gameID]?.clients.forEach((c) => {
              c.conn.socket.send(
                JSON.stringify({
                  type: WebsocketType.GameJoinAck,
                  data: {
                    message: `[WS] Player has joined game ${gameID}.`,
                    username: username,
                    userType: userType,
                    gameCode: gameCode,
                    JWT: token,
                  },
                } as WebsocketResponse)
              );
            });
            // Handle message
            switch (data.type) {
              case WebsocketType.GameSetup: {
                if (userType === "Game" && !connections[gameID]) {
                  // Create spot in the connections array for players
                  connections[gameID] = {
                    host: { username: username, conn: conn },
                    clients: [],
                  };
                } else if (userType !== "Game") {
                  conn.socket.send(
                    JSON.stringify({
                      type: WebsocketType.Error,
                      data: {
                        message: `[WS] Only the game node can set-up a game.`,
                      },
                    } as WebsocketResponse)
                  );
                } else {
                  conn.socket.send(
                    JSON.stringify({
                      type: WebsocketType.Error,
                      data: {
                        message: `[WS] A user has already connected to this game as the host.`,
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
                } else if (userType !== "Client") {
                  conn.socket.send(
                    JSON.stringify({
                      type: WebsocketType.Error,
                      data: {
                        message: `[WS] Game nodes cannot connect as players.`,
                      },
                    } as WebsocketResponse)
                  );
                } else {
                  conn.socket.send(
                    JSON.stringify({
                      type: WebsocketType.Error,
                      data: {
                        message: `[WS] The host has not yet connected to the game. Please try again later.`,
                      },
                    } as WebsocketResponse)
                  );
                }
                break;
              }
              case WebsocketType.Ping:
              default: {
                // Handle Pong Response
                conn.socket.send(
                  JSON.stringify({
                    type: WebsocketType.Pong,
                    data: {
                      message: "[WS] Pong!",
                    },
                  } as WebsocketResponse)
                );
                break;
              }
            }
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
              data: {
                message:
                  "[WS] This connection was never associated with a game.",
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
            } as WebsocketResponse)
          );
          connections[gameID].clients.forEach((c) => {
            c.conn.socket.send(
              JSON.stringify({
                type: WebsocketType.GameEndedAck,
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
              data: {
                username: connections[gameID].host.username,
              },
            } as WebsocketResponse)
          );
          connections[gameID].clients.forEach((c) => {
            c.conn.socket.send(
              JSON.stringify({
                type: WebsocketType.PlayerDisconnectAck,
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
