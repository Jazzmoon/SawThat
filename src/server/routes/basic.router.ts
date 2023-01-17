import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify";

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
