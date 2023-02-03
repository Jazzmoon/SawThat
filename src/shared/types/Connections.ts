/**
 * @file Connections.ts
 * @author Mark Hutchison
 * Type related to websocket connection information.
 */

import { SocketStream } from "../../server/node_modules/@fastify/websocket";
import { TurnModifier } from "../enums/TurnModifier";

export type ClientConn = {
  username: string;
  conn: SocketStream;
};

export type Connection = {
  host: ClientConn;
  clients: ClientConn[];
  turn?: {
    turn_start: number;
    timeout?: NodeJS.Timeout;
    turn_modifier: TurnModifier;
    movement_die: number;
    answered: string[];
  };
};

export type Connections = Record<string, Connection>;
