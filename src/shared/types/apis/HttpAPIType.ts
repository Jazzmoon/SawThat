import type { Player } from "../shared/types/Player";

export type JoinResponse = {
    username: string,
    token: string
} & ErrorResponse;

export type CreateResponse = {
    // TODO I DON"T THINK WE NEED THIS ENTIRE SUB-OBJECT. THE GAMECODE AND TOKEN ARE ALL THAT THE GAME NODE NEEDS
    game: {
        hostID: string,
        game_code: string,
        themPack: string,
        players: Player[],
        used_questions: string[],
        used_consequences: string[]
    },
    gameID: string,
    userToken: string,
} & ErrorResponse;

export type ErrorResponse = {
    error: string,
    message: string
};