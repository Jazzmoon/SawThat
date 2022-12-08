import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { basicGet } from "../controllers/GameController";

const GameRouter: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  opts,
  done
) => {
  fastify.route({
    method: "GET",
    url: "/",
    schema: {},
    handler: basicGet,
  });
  done();
};

export default GameRouter;
