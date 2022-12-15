import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { joinGame } from "../controllers/ClientController";

const ClientRouter: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  opts,
  done
) => {
  fastify.route({
    method: "GET",
    url: "/join",
    schema: {
      body: {
        username: { type: "string" },
        game_code: { type: "string" },
      },
      response: {
        200: {
          username: { type: "string" },
          token: { type: "string" },
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
