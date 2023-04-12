/**
 * @file game.router.ts
 * @author Mark Hutchison
 * Router dedicated to handling game node interactions.
 */
import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { createGame, getThemePacksAPI } from "../controllers/GameController";

/**
 * The handling function for the game node router.
 * It receives a request and various parameters, and handles it appropriately.
 * @param {FastifyInstance} fastify - The root fastify instance that the router is attaching itself to.
 * @param {Record} opts - Configuration options relevant to only this specific sub-router.
 * @param done - Function that indicates the end of definitions.
 */
const GameRouter: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  opts,
  done
) => {
  fastify.route({
    method: "GET",
    url: "/themes",
    schema: {
      response: {
        200: {
          type: "array",
          items: { type: "string" },
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
    handler: getThemePacksAPI,
  });
  fastify.route({
    method: "POST",
    url: "/create",
    schema: {
      body: {
        type: "object",
        properties: {
          theme_pack: { type: "string" },
          question_timer: { type: ["number", "null"] },
          consequence_timer: { type: ["number", "null"] },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
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
