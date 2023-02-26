import { SocketStream } from "@fastify/websocket";
import { MutexInterface } from "async-mutex";
import { TurnModifier } from "../../shared/enums/TurnModifier";

export type ClientConn = {
  username: string;
  conn: SocketStream;
};

export type Connection = {
  host: ClientConn;
  clients: ClientConn[];
  turn?: {
    mutex: MutexInterface;
    turn_start: number;
    timeout?: NodeJS.Timeout;
    all_play: boolean;
    turn_modifier: TurnModifier;
    movement_die: number;
    answered: string[];
  };
};

export type Connections = Record<string, Connection>;
