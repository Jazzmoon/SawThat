import fastify, { FastifyInstance } from "fastify";

const app: FastifyInstance = fastify({
  logger: true,
});

app.get("/", async (req, res) => {
  return { hello: "world" };
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    console.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});
