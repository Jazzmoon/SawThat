/**
 * Static class that wraps websockets to facilitate communication with the server
 * during the game.
 */
export class WS_API {
    private static socket: WebSocket | null = null;

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
        let promisePass: Function;
        const connectedPromise = new Promise((pass, fail) => {
            promisePass = pass;
        });

        WS_API.socket = new WebSocket(wsURL);

        // fire the promise when it opens and is ready for communication
        WS_API.socket.onopen = (event: Event) => {
            promisePass();
        };
        
        WS_API.socket.onmessage = (event: MessageEvent) => {
            WS_API.handleMessageFromServer(event.data);
        };
        
        WS_API.socket.onerror = (event: Event) => {
            promisePass();
            alert("An error occured with the connection to the server"); // TODO HANDLE BY EXITING GAME
        }

        await connectedPromise;
        return WS_API.socket.readyState === WebSocket.OPEN;
    }

    private static handleMessageFromServer(data: string) {
        // TODO TOKENIZE AND THEN PROCESS
        console.log("RECEVIED DATA FROM SERVER OVER WEBSOCKETS:");
        console.log(data);
    }
}