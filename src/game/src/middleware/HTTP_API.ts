import Base_HTTP_API from "../../../shared/Base_HTTP_API";
import type { CreateResponse } from "../../../shared/apis/HttpAPIType";

/**
 * Static class that wraps http requests to facilitate communication with the server
 * during the game.
 */
export class HTTP_API extends Base_HTTP_API {
    private static serverUrl = "https://sawthatgame.jazzmoon.ca/api/game"

    /**
     * no-op but this method should not be used from outside this class
     * so it is made private.
    */
    private constructor() {
        super();
    }

    /**
     * Fetches the available theme packs
     * @returns
     */
    public static getAvailableThemePacks(): Promise<string[]> {
        return HTTP_API.sendGET(`${this.serverUrl}/themes`);
    }

    /**
     * Sends a request to start a game
     * @param themepack the id of the theme pack
     */
    public static sendCreate(theme_pack: string): Promise<CreateResponse> {
        return HTTP_API.sendPOST(`${this.serverUrl}/create`, {
            theme_pack: theme_pack
        });
    }
}