import Base_WS_API from "../../../shared/Base_WS_API";
/**
 * Static class that wraps websockets to facilitate communication with the server
 * during the game.
 */
export class WS_API extends Base_WS_API {
    private static serverURL = "https://sawthatgame.jazzmoon.host/api/ws";

    /**
     * no-op but this method should not be used from outside this class
     * so it is made private. Users of this class should call the Base_WS_API.setupWebSocketConnection
     * static method through this class
    */
    private constructor() {
        super();
    }

    /**
     * Sets up a websocket connection with the server
     * @param gameCode the id of the game to join
     * @returns 
     */
    public static async setupWebSocketConnection(gameCode: string): Promise<boolean> {
        return super.setupWebSocketConnection(`${WS_API.serverURL}/${gameCode}`);
    }

    /**
     * Attempts to create a new game with the server
     * @returns the game code if the game was created. undefined if some error occured.
     */
    public static async sendCreateGameRequest(): Promise<string | undefined> {
        // TODO implement via the send request method
        return "12345";
    }

    /**
     * Attempts to start the game with the server
     * @returns true if the game was started. False if some error occured.
     */
    public static async sendStartGameRequest(): Promise<boolean> {
        // TODO implement via the send request method
        return true;
    }
}