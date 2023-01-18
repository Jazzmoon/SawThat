import Base_HTTP_API from "../../../shared/Base_HTTP_API";
import type { CreateResponse } from "../../../types/apis/HttpAPIType";

/**
 * Static class that wraps http requests to facilitate communication with the server
 * during the game.
 */
export class HTTP_API extends Base_HTTP_API {
    private static serverUrl = "https://sawthatgame.jazzmoon.host/api/game"

    /**
     * no-op but this method should not be used from outside this class
     * so it is made private.
    */
    private constructor() {
        super();
    }

    /**
     * Sends a request to start a game
     * @param themepack the id of the theme pack (TODO THIS SHOULD BE A URL OR A FILE UPLOAD THING)
     */
    public static sendCreate(theme_pack: string): Promise<CreateResponse> {
        return HTTP_API.sendPOST(`${this.serverUrl}/create`, {
            theme_pack: theme_pack
        });
    }

    // TODO MARK SAID THIS IS DONE OVER WS
    // /**
    //  * Sends a request to start a game
    //  * @param playerName the id of the player to add
    //  * @param gameCode the game code of the game to join
    //  */
    // public static sendStartRequest(gameCode: string): Promise<any> {
    //     return HTTP_API.sendPOST(`${this.serverUrl}/start`, {
    //         game_code: gameCode
    //     });
    // }
}