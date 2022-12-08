import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { basicGet } from "../controllers/ClientController";

const ClientRouter: FastifyPluginCallback = async (
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

export default ClientRouter;
