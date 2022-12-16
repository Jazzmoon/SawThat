import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { joinGame } from "../controllers/ClientController";

const ClientRouter: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  opts,
  done
) => {
  fastify.route({
    method: "POST",
    url: "/join",
    schema: {
      body: {
        type: "object",
        properties: {
          username: { type: "string" },
          game_code: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            username: { type: "string" },
            token: { type: "string" },
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
    handler: joinGame,
  });
  done();
};

export default ClientRouter;
