import type { GameJoinAckData, WebSocketError } from "../../../shared/apis/WebSocketAPIType";
import Base_WS_API from "../../../shared/Base_WS_API";
import { WebsocketType } from "../../../shared/enums/WebsocketTypes";
import type { WebsocketMessage } from "../../../shared/types/Websocket";
/**
 * Static class that wraps websockets to facilitate communication with the server
 * during the game.
 */
export class WS_API extends Base_WS_API {
    private static serverURL = "wss://sawthat.jazzmoon.host/api/ws";

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
     * @param gameCode 
     * @returns 
     */
    public static async setupWebSocketConnection(gameCode: string): Promise<boolean> {
        return super.setupWebSocketConnection(`${WS_API.serverURL}/${gameCode}`);
    }

    /**
     * Sends a request to join a game
     */
    public static async sendJoinRequest(): Promise<WebsocketMessage<GameJoinAckData | WebSocketError>> {
        return await WS_API.sendRequest(WebsocketType.GameJoin, {});
    }
}