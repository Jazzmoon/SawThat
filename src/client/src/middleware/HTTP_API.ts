import Base_HTTP_API from "../../../shared/Base_HTTP_API";
/**
 * Static class that wraps http requests to facilitate communication with the server
 * during the game.
 */
export class HTTP_API extends Base_HTTP_API {

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
    public static sendJoinRequest(playerName: string, gameCode: string): Promise<{
        username: string,
        token: string // TODO MAKE THIS A PROPER TYPE and add error type into it
    }> {
        return HTTP_API.sendPOST('join', {
            playerName: playerName,
            gameCode: gameCode
        });
    }
}