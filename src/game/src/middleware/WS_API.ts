/**
 * Static class that wraps websockets to facilitate communication with the server
 * during the game.
 */
export class WS_API {
    private static socket: WebSocket | null = null;
    private static pendingRequests: Record<string, {success: Function, fail: Function}> = {};
    private static incomingMessageCallback: ((data: object) => void) | null = null;

    /**
     * no-op but this method should not be used from outside this class
     * so it is made private
    */
    private constructor() {}

    /**
     * Sets the callback method that is called with the parsed data when the server sends data to this node.
     * @param incomingMessageCallback 
     */
    public static setIncomingMessageCallback(incomingMessageCallback: (data: object) => void): void {
        WS_API.incomingMessageCallback = incomingMessageCallback;
    }

    /**
     * Attempts to setup a connection to the Server via
     * WebSockets.
     * @param wsURL the url for the websocket connection
     * @returns an awaitable promise that indicates if the connection was successful
     */
    public static async setupWebSocketConnection(wsURL: string): Promise<boolean> {
        // create a promise to await the connection to open before returning
        const requestId = WS_API.createRequestId('connect');
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

    /**
     * Handles all incoming messages from the server
     * @param data the raw string that is received from the server per each message
     * @param incomingMessageCallback the callback to call with the parsed payload from the message
     */
    private static handleMessageFromServer(rawData: string): void {
        const data = JSON.parse(rawData);

        // if the request was initiated by the game node, end the promise that is waiting for it
        if (WS_API.pendingRequests[data.requestId]) {
            WS_API.pendingRequests[data.requestId].success();
            delete WS_API.pendingRequests[data.requestId];
        }
        
        if (WS_API.incomingMessageCallback) {
            WS_API.incomingMessageCallback(data);
        }
    }

    /**
     * Sends a request over websockets to the server and waits for a response
     * @param type the type of request
     * @param payload the data to send
     * @returns an awaitable promise that resolves once the request finishes
     */
    private static async sendRequest(type: string, payload: object): Promise<any> {
        const requestId = WS_API.createRequestId(type);

        // assign the requestId to the payload
        Object.defineProperty(payload, 'requestId', {
            value: requestId,
            writable: false
        });

        WS_API.socket?.send(JSON.stringify(payload));

        return WS_API.addRequestToQueue(requestId);
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