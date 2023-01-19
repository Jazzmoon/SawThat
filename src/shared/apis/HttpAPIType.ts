import type { Player } from "../types/Player";

export type JoinResponse = {
  username: string;
  token: string;
} & ErrorResponse;

export type CreateResponse = {
  gameID: string;
  userToken: string;
} & ErrorResponse;

export type ErrorResponse = {
  error: string;
  message: string;
};
