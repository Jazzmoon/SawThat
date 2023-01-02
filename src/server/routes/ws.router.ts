import { SocketStream } from "@fastify/websocket";
import { FastifyPluginCallback, FastifyRequest } from "fastify";
import jwt, { Secret } from "jsonwebtoken";

const WSRouter: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.get(
    "/:gameID",
    { websocket: true },
    (conn: SocketStream, req: FastifyRequest) => {
      const { gameID } = req.params as { gameID: string };
      console.log(`[WS] Game ID: ${gameID}`);
      conn.setEncoding("utf8");
      conn.socket.on("message", (stream) => {
        // Validate data stream contains required information about user
        const data = JSON.parse(stream.toString());
        try {
        } catch (error) {}
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
            console.log(`JWT: ${token}`);
          }
        );
      });
    }
  );
  done();
};

export default WSRouter;
