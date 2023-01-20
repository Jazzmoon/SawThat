/**
 * @file HttpAPIType.ts
 * @author Mark Hutchison
 * Details the structure of data that will be transferred over the
 * REST API connection.
 */

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
