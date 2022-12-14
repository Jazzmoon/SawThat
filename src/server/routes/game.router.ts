import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { createGame } from "../controllers/GameController";

const GameRouter: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  opts,
  done
) => {
  fastify.route({
    method: "POST",
    url: "/create",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            game: { type: "object" },
            gameID: { type: "string" },
            userToken: { type: "string" },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
    handler: createGame,
  });
  done();
};

export default GameRouter;
