import { FastifyPluginCallback } from "fastify";
import { basicGet } from "../controllers/WSController";

const WSRouter: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.route({
    method: "GET",
    url: "/",
    schema: {},
    handler: basicGet,
    wsHandler: (conn, req) => {
      conn.setEncoding("utf8");
      conn.write("Hello Client");
    },
  });
  done();
};

export default WSRouter;
