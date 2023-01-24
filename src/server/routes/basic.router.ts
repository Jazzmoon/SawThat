/**
 * @file ws.router.ts
 * @author Mark Hutchison
 * Router dedicated to handling non-node specific interactions.
 */
import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify";

/**
 * A universal router meant for handling requests that are non-node specific.
 * @param {FastifyInstance} fastify - The root fastify instance that the router is attaching itself to.
 * @param {Record} opts - Configuration options relevant to only this specific sub-router.
 * @param done - Function that indicates the end of definitions.
 */
const BasicRouter: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  opts,
  done
) => {
  fastify.route({
    method: "GET",
    url: "/ping",
    schema: {
      response: {
        200: {
          type: "string",
        },
      },
    },
    handler: async (req: FastifyRequest, res: FastifyReply) => {
      res.code(200).send("Pong!");
      return Promise.resolve(res);
    },
  });
  done();
};

export default BasicRouter;
