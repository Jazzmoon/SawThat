import Base_HTTP_API from "../../../shared/Base_HTTP_API";
import type { JoinResponse } from "../../../shared/apis/HttpAPIType";

/**
 * Static class that wraps http requests to facilitate communication with the server
 * during the game.
 */
export class HTTP_API extends Base_HTTP_API {
    private static serverUrl = "https://sawthat.jazzmoon.host/api/client";
    /**
     * no-op but this method should not be used from outside this class
     * so it is made private.
    */
    private constructor() {
        super();
    }

    /**
     * Sends a request to join a game
     * @param playerName the id of the player to add
     * @param gameCode the game code of the game to join
     */
    public static sendJoinRequest(playerName: string, gameCode: string): Promise<JoinResponse> {
        return HTTP_API.sendPOST(`${this.serverUrl}/join`, {
            username: playerName,
            game_code: gameCode
        });
    }
}