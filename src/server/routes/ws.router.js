"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WSController_1 = require("../controllers/WSController");
const WSRouter = async (fastify, opts, done) => {
    fastify.route({
        method: "GET",
        url: "/",
        schema: {},
        handler: WSController_1.basicGet,
        wsHandler: (conn, req) => {
            conn.setEncoding("utf8");
            conn.write("Hello Client");
        },
    });
    done();
};
exports.default = WSRouter;
