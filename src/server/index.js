"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Fastify Requirements
const fastify_1 = __importDefault(require("fastify"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
// Import Routers
const client_router_1 = __importDefault(require("./routes/client.router"));
const game_router_1 = __importDefault(require("./routes/game.router"));
const ws_router_1 = __importDefault(require("./routes/ws.router"));
// Set-Up Fastify Instance
const app = (0, fastify_1.default)({
    logger: true,
});
app.register(websocket_1.default);
// Bind Routes
app.register(client_router_1.default, { prefix: "/client" });
app.register(game_router_1.default, { prefix: "/game" });
app.register(ws_router_1.default, { prefix: "/ws" });
app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        app.log.error(err);
        console.error(err);
        process.exit(1);
    }
    app.log.info(`Server listening on ${address}`);
});
