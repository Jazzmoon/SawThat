import { SocketStream } from "@fastify/websocket";
import { TurnModifier } from "../../shared/enums/TurnModifier";

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
