/**
 * @file ws.router.ts
 * @author Mark Hutchison
 * Router dedicated to handling client node interactions.
 */
import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { joinGame } from "../controllers/ClientController";

/**
 * The handling function for the client node router.
 * It receives a request and various parameters, and handles it appropriately.
 * @param {FastifyInstance} fastify The root fastify instance that the router is attaching itself to.
 * @param {Record} opts Configuration options relevant to only this specific sub-router.
 * @param done Function that indicates the end of definitions.
 */
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
