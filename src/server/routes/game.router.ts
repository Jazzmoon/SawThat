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
      body: {
        type: "object",
        properties: {
          theme_pack: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            game: {
              type: "object",
              properties: {
                hostID: { type: "string" },
                game_code: { type: "string" },
                themePack: { type: "string" },
                players: { type: "array", items: { type: "object" } },
                used_questions: { type: "array" },
                used_consequences: { type: "array" },
              },
            },
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
