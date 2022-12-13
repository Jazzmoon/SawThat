import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { basicGet, createGame } from "../controllers/GameController";

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

  fastify.route({
    method: "POST",
    url: "/create",
    schema: {},
    handler: createGame,
  });
  done();
};

export default GameRouter;
