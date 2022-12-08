"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameController_1 = require("../controllers/GameController");
const GameRouter = async (fastify, opts, done) => {
    fastify.route({
        method: "GET",
        url: "/",
        schema: {},
        handler: GameController_1.basicGet,
    });
    done();
};
exports.default = GameRouter;
