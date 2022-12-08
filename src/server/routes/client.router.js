"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientController_1 = require("../controllers/ClientController");
const ClientRouter = async (fastify, opts, done) => {
    fastify.route({
        method: "GET",
        url: "/",
        schema: {},
        handler: ClientController_1.basicGet,
    });
    done();
};
exports.default = ClientRouter;
