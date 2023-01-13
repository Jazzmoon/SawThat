import Base_WS_API from "../../../shared/Base_WS_API";
/**
 * Static class that wraps websockets to facilitate communication with the server
 * during the game.
 */
export class WS_API extends Base_WS_API {

    /**
     * no-op but this method should not be used from outside this class
     * so it is made private. Users of this class should call the Base_WS_API.setupWebSocketConnection
     * static method through this class
    */
    private constructor() {
        super();
    }

    /**
     * Sends a request to join a game
     * @param playerName the id of the player to add
     * @param gameCode the game code of the game to join
     */
    public static sendJoinRequest(playerName: string, gameCode: string): Promise<boolean> {
        return WS_API.sendRequest('join', {
            playerName: playerName,
            gameCode: gameCode
        });
    }
}