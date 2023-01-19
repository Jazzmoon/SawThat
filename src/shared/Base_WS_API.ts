import { WebsocketType } from "./enums/WebsocketTypes";
import type { WebsocketMessage } from "./types/Websocket";
/**
 * class that wraps websockets to facilitate communication with the server
 * during the game.
 */
export default class Base_WS_API {
    private static socket: WebSocket | null = null;
    private static pendingRequests: Record<string, {success: Function, fail: Function}> = {};
    private static incomingMessageCallbacks: Record<string, ((data: WebsocketMessage) => void)> = {};
    private static token = "";

    /**
     * no-op but this method should not be used from outside this class
     * so it is made private
    */
    protected constructor() {}

    public static setUserToken(userToken: string) {
        Base_WS_API.token = userToken;
    }

    /**
     * Adds a callback method that is called with the parsed data when the server sends data to this node.
     * @param id the id of the callback that can then be used to unassign it
     * @param incomingMessageCallback the callback function
     */
    public static addIncomingMessageCallback(id: string, incomingMessageCallback: (data: WebsocketMessage) => void): void {
        Base_WS_API.incomingMessageCallbacks[id] = incomingMessageCallback;
    }

    /**
     * Removed a callback method that is called with the parsed data when the server sends data to this node.
     * @param id the id of the callback to remove 
     */
    public static removeIncomingMessageCallback(id: string): void {
        if (Base_WS_API.incomingMessageCallbacks[id]) {
            delete Base_WS_API.incomingMessageCallbacks[id];
        }
    }

    /**
     * Attempts to setup a connection to the Server via
     * WebSockets.
     * @param wsURL the url for the websocket connection
     * @returns an awaitable promise that indicates if the connection was successful
     */
    protected static async setupWebSocketConnection(wsURL: string): Promise<boolean> {
        // create a promise to await the connection to open before returning
        const requestId = Base_WS_API.createRequestId('connect');
        const promise = Base_WS_API.addRequestToQueue(requestId);

        Base_WS_API.socket = new WebSocket(wsURL);

        // fire the promise when it opens and is ready for communication
        Base_WS_API.socket.onopen = (event: Event) => {
            // complete the promise as initial handshake is now complete
            Base_WS_API.pendingRequests[requestId]?.success();
        };
        
        Base_WS_API.socket.onmessage = (event: MessageEvent) => {
            Base_WS_API.handleMessageFromServer(event.data);
        };
        
        Base_WS_API.socket.onerror = (event: Event) => {
            Base_WS_API.pendingRequests[requestId]?.fail();
        }

        try {
            await promise;
        } catch (exception) {
            for (const callback of Object.values(Base_WS_API.incomingMessageCallbacks)) {
                callback({
                    type: WebsocketType.Error,
                    data: {
                        error: exception,
                        message: "An error occured with the connection to the server"
                    }
                });
            }
        }

        return Base_WS_API.socket.readyState === WebSocket.OPEN;
    }

    /**
     * Handles all incoming messages from the server
     * @param data the raw string that is received from the server per each message
     * @param incomingMessageCallback the callback to call with the parsed payload from the message
     */
    private static handleMessageFromServer(rawData: string): void {
        const data = JSON.parse(rawData);

        // if the request was initiated by the game node, end the promise that is waiting for it
        if (Base_WS_API.pendingRequests[data.requestId]) {
            Base_WS_API.pendingRequests[data.requestId].success();
            delete Base_WS_API.pendingRequests[data.requestId];
        }
        
        for (const callback of Object.values(Base_WS_API.incomingMessageCallbacks)) {
            callback(data);
        }
    }

    /**
     * Sends a request over websockets to the server and waits for a response
     * @param type the type of request
     * @param payload the data to send
     * @returns an awaitable promise that resolves once the request finishes
     */
    protected static async sendRequest(type: WebsocketType, payload: object): Promise<WebsocketMessage> {
        if (Base_WS_API.socket?.readyState !== WebSocket.OPEN) {
            return {
                type: WebsocketType.Error,
                data: {
                    message: "Attempted to send a message over a non-open socket"
                }
            };
        }
        
        const requestId = Base_WS_API.createRequestId(type);

        // assign the requestId to the payload
        Object.defineProperty(payload, 'requestId', {
            value: requestId,
            writable: false
        });

        // assign the token to the payload
        Object.defineProperty(payload, 'token', {
            value: Base_WS_API.token,
            writable: false
        });

        console.log("token", Base_WS_API.token);
        console.log(JSON.stringify(payload)) // TODO REMOVE THIS FOR PROD

        Base_WS_API.socket?.send(JSON.stringify(payload));

        return Base_WS_API.addRequestToQueue(requestId);
    }

    /**
     * Create a new promise that is pending the return of a request
     * @param requestId id of the request 
     * @returns the awaitable promise that will resolve when the request is filled
     */
    private static addRequestToQueue(requestId: string): Promise<WebsocketMessage> {
        const connectedPromise = new Promise<WebsocketMessage>((pass, fail) => {
            Base_WS_API.pendingRequests[requestId] = {success: pass, fail: fail};
        });
        return connectedPromise;
    }

    /**
     * Creates a unique key for the request
     * @param type the type of the request (included in the key for readability)
     * @returns a string for the newly created key
     */
    private static createRequestId(type: WebsocketType | string): string {
        return `${type}${Date.now()}`; // TODO FIND A BETTER WAY
    }
}