import * as dotenv from "dotenv";

// Import Fastify Requirements
import fastify, { FastifyInstance } from "fastify";
import websocket from "@fastify/websocket";

// Import Mongoose
import mongoose from "mongoose";

// Import Routers
import ClientRouter from "./routes/client.router";
import GameRouter from "./routes/game.router";
import WSRouter from "./routes/ws.router";

dotenv.config();

// Establish Mongoose connection
console.log(`Connecting to: ${process.env.DATABASE_URL}`);
mongoose.connect(`${process.env.DATABASE_URL!}`, {
  user: process.env.DATABASE_USER!,
  pass: process.env.DATABASE_PASS!,
});

const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => console.log("Database connection established."));

// Set-Up Fastify Instance
const app: FastifyInstance = fastify({
  logger: true,
});
app.register(websocket);

// Bind Routes
app.register(ClientRouter, { prefix: "/client" });
app.register(GameRouter, { prefix: "/game" });
app.register(WSRouter, { prefix: "/ws" });

// Spin up the backend
app.listen({ port: parseInt(process.env.PORT!) }, (err, address) => {
  if (err) {
    app.log.error(err);
    console.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});
