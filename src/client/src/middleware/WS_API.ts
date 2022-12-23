/**
 * Static class that wraps websockets to facilitate communication with the server
 * during the game.
 */
export class WS_API {
    private static socket: WebSocket | null = null;
    private static pendingRequests: Record<string, {success: Function, fail: Function}> = {};

    private WS_API() {
        // no-op but this method should not be used from outside this class
        // so it is made private
    }

    /**
     * Attempts to setup a connection to the Server via
     * WebSockets.
     */
    public static async setupWebSocketConnection(wsURL: string): Promise<boolean> {
        // create a promise to await the connection to open before returning
        const requestId = this.createRequestId('connect');
        const promise = WS_API.addRequestToQueue(requestId);

        WS_API.socket = new WebSocket(wsURL);

        // fire the promise when it opens and is ready for communication
        WS_API.socket.onopen = (event: Event) => {
            WS_API.pendingRequests[requestId]?.success();
        };
        
        WS_API.socket.onmessage = (event: MessageEvent) => {
            WS_API.handleMessageFromServer(event.data);
        };
        
        WS_API.socket.onerror = (event: Event) => {
            WS_API.pendingRequests[requestId]?.fail();
        }

        try {
            await promise;
        } catch (exception) {
            alert("An error occured with the connection to the server"); // TODO HANDLE BY EXITING GAME
        }

        return WS_API.socket.readyState === WebSocket.OPEN;
    }

    /**
     * Sends a request to join a game
     * @param playerName the id of the player to add
     * @param gameCode the game code of the game to join
     */
    public static sendJoinRequest(playerName: string, gameCode: string): Promise<boolean> {
        const requestId = this.createRequestId('join');

        WS_API.socket?.send(JSON.stringify({
            requestId: requestId,
            playerName: playerName,
            gameCode: gameCode
        }));


        return WS_API.addRequestToQueue(requestId);
    }

    /**
     * Handles all incoming messages from the server
     * @param data the raw string that is received from the server per each message
     */
    private static handleMessageFromServer(rawData: string): void {
        const data = JSON.parse(rawData); // TODO type this thing

        // switch(data.requestType) { // todo

        // }

        WS_API.pendingRequests[data.requestId].success(); // todo handle th failure case
        delete WS_API.pendingRequests[data.requestId];
    }

    /**
     * Create a new promise that is pending the return of a request
     * @param requestId id of the request 
     * @returns the awaitable promise that will resolve when the request is filled
     */
    private static addRequestToQueue(requestId: string): Promise<any> {
        const connectedPromise = new Promise((pass, fail) => {
            WS_API.pendingRequests[requestId] = {success: pass, fail: fail};
        });
        return connectedPromise;
    }

    /**
     * Creates a unique key for the request
     * @param type the type of the request (included in the key for readability)
     * @returns a string for the newly created key
     */
    private static createRequestId(type: string): string {
        return `${type}${Date.now()}`;
    }
}