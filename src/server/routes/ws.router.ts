import { SocketStream } from "@fastify/websocket";
import { FastifyPluginCallback, FastifyRequest } from "fastify";
import { connect } from "http2";
import jwt, { Secret } from "jsonwebtoken";
import { WebSocket } from "ws";

// Create Record to match WS to GameID
let connections: Record<string, Array<SocketStream>> = {};

const WSRouter: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.get(
    "/:gameID",
    { websocket: true },
    (conn: SocketStream, req: FastifyRequest) => {
      // Set WebSocket Encoding
      conn.setEncoding("utf8");

      // Get params and data
      const { gameID } = req.params as { gameID: string };
      console.log(`[WS] Connection Received for game with ID: ${gameID}`);

      /*
      | Connect:
      * 1. Get the game id from the request params
      * 2. Add connection to the `connections` record
      */ // Verify that game has a connection array
      if (!connections[gameID]) {
        connections[gameID] = [];
      }
      // Add connection socket to array
      connections[gameID].push(conn);

      // Verify socket added
      console.log(`[WS] Connection added: ${connections[gameID]}`);

      /*
      | Message:
      * 1. Validate connection via JWT
      * 2. Handle message via switch
      */
      conn.socket.on("message", (stream) => {
        // Validate data stream contains required information about user
        const data = JSON.parse(stream.toString());
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
                    error: {
                      name: err.name,
                      message: err.message,
                    },
                    data: data.token,
                  })
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
                  message: "[WS] Game ID and JWT mismatch.",
                  data: `You requested game with ID ${gameID} but have a JWT for game ${gameCode}.`,
                })
              );
              conn.end();
              return;
            }
            // Send confirmation to current socket that they have joined:
            conn.socket.send(
              JSON.stringify({
                message: `[WS] Game with ID ${gameID} joined successfully.`,
                data: {
                  JWT: token,
                  username: username,
                  userType: userType,
                  gameCode: gameCode,
                },
              })
            );
            // Send message to everyone in game to confirm user has joined:
            connections[gameID].forEach((c) => {
              c.socket.send(
                JSON.stringify({
                  message: `[WS] Player has joined game ${gameID}.`,
                  data: {
                    JWT: token,
                    username: username,
                    userType: userType,
                    gameCode: gameCode,
                  },
                })
              );
            });
          }
        );
        // Handle message
      });

      /*
      | Disconnect:
      * 1. Find client within the connections record and remove them from the connections array
      */
      conn.socket.on("close", (stream) => {
        // Remove conn from connection array
        connections[gameID] = connections[gameID].filter((c) => c !== conn);
      });
    }
  );
  done();
};

export default WSRouter;
