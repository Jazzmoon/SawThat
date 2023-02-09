import Base_WS_API from "../Base_WS_API"
import { WebsocketType } from "../enums/WebsocketTypes";

class Testable_WS_API extends Base_WS_API {
    constructor() {
        super();
    }

    public static async setupWebSocketConnection(): Promise<boolean> {
        return super.setupWebSocketConnection(`testurl`);
    }
}

class MockWebSocket {
    constructor() {

    }
    close() {}
}

beforeEach(() => {
    //@ts-ignore
    expect(Testable_WS_API.socket).toBeNull();
    //@ts-ignore
    expect(JSON.stringify(Testable_WS_API.pendingRequests)).toBe('{}');
    //@ts-ignore
    expect(JSON.stringify(Testable_WS_API.incomingMessageCallbacks)).toBe('{}');
    //@ts-ignore
    expect(Testable_WS_API.token).toBe("");

    // stub out websockets
    // @ts-ignore
    global.WebSocket = MockWebSocket;
})

afterEach(() => {
    Testable_WS_API.resetConnection();
})

test('Test Base_WS_API is created properly when setting up a connection', async () => {
    try {
        const result = Testable_WS_API.setupWebSocketConnection();
        // @ts-ignore
        Object.values(Testable_WS_API.pendingRequests)[0].success();
        await result;
    } catch (e) {
        expect(false).toBe(true); // in this case the connection establishment failed when it should have passed
    }
});

test('Test Base_WS_API fails properly when it fails to establish a connection', async () => {
    try {
        const result = Testable_WS_API.setupWebSocketConnection();
        // @ts-ignore
        Object.values(Testable_WS_API.pendingRequests)[0].fail();
        await result;
        expect(false).toBe(true); // in this case the connection establishment succedded when it should have failed
    } catch (e) {
        expect(true).toBe(true); // in this case the connection establishment failed like it should have
    }
});

test('Test Base_WS_API message callback setters and getters work', () => {
    // @ts-ignore
    expect(Object.values(Testable_WS_API.incomingMessageCallbacks).length).toBe(0);
    Testable_WS_API.addIncomingMessageCallback("test1", () => {}); // add
    // @ts-ignore
    expect(Object.values(Testable_WS_API.incomingMessageCallbacks).length).toBe(1);
    Testable_WS_API.addIncomingMessageCallback("test2", () => {}); // add
    // @ts-ignore
    expect(Object.values(Testable_WS_API.incomingMessageCallbacks).length).toBe(2);
    Testable_WS_API.addIncomingMessageCallback("test2", () => {}); // overwrite
    // @ts-ignore
    expect(Object.values(Testable_WS_API.incomingMessageCallbacks).length).toBe(2);
    Testable_WS_API.removeIncomingMessageCallback("test1"); // remove
    // @ts-ignore
    expect(Object.values(Testable_WS_API.incomingMessageCallbacks).length).toBe(1);
    Testable_WS_API.removeIncomingMessageCallback("test1567"); // remove
    // @ts-ignore
    expect(Object.values(Testable_WS_API.incomingMessageCallbacks).length).toBe(1);
});

test('Test Base_WS_API reset connection destroys everything properly', async () => {
    //@ts-ignore
    expect(Testable_WS_API.socket).toBeNull();
    //@ts-ignore
    expect(JSON.stringify(Testable_WS_API.pendingRequests)).toBe('{}');
    //@ts-ignore
    expect(Testable_WS_API.token).toBe("");
    
    try {
        const result = Testable_WS_API.setupWebSocketConnection();
        // @ts-ignore
        Object.values(Testable_WS_API.pendingRequests)[0].fail();
        await result;
        expect(false).toBe(true); // in this case the connection establishment succedded when it should have failed
    } catch (e) {
        expect(true).toBe(true); // in this case the connection establishment failed like it should have
    }

    Testable_WS_API.setUserToken("testToken")
    
    //@ts-ignore
    expect(Testable_WS_API.socket).toBeInstanceOf(MockWebSocket);
    //@ts-ignore
    expect(Object.entries(Testable_WS_API.pendingRequests).length).toBe(1); // in prod this would be 0 but since we are manipulating the requests manually and never clear it, we have 1 left. It serves as a useful thing here though as we can check that the requests are cleared by reset
    //@ts-ignore
    expect(Testable_WS_API.token).toBe("testToken");

    Testable_WS_API.resetConnection();

    //@ts-ignore
    expect(Testable_WS_API.socket).toBeNull();
    //@ts-ignore
    expect(JSON.stringify(Testable_WS_API.pendingRequests)).toBe('{}');
    //@ts-ignore
    expect(Testable_WS_API.token).toBe("");
});

test('Test Base_WS_API handles new messages properly', () => {
    let counter = 0;
    Testable_WS_API.addIncomingMessageCallback("testCallback1", (data: any) => {
        counter += data.counter;
    });
    Testable_WS_API.addIncomingMessageCallback("testCallback2", (data: any) => {
        counter += data.counter;
    });
    
    // @ts-ignore
    Testable_WS_API.handleMessageFromServer(JSON.stringify({
        counter: 1
    }));

    expect(counter).toBe(2);

    Testable_WS_API.removeIncomingMessageCallback("testCallback2");

    // @ts-ignore
    Testable_WS_API.handleMessageFromServer(JSON.stringify({
        counter: 1
    }));

    expect(counter).toBe(3);

    //add a pending request
    // @ts-ignore
    expect(Object.entries(Testable_WS_API.pendingRequests).length).toBe(0);
    // @ts-ignore
    Testable_WS_API.pendingRequests[2] = {success: () => {}, fail: () => {}};
    // @ts-ignore
    expect(Object.entries(Testable_WS_API.pendingRequests).length).toBe(1);

    // @ts-ignore
    Testable_WS_API.handleMessageFromServer(JSON.stringify({
        counter: 1,
        requestId: 2
    }));

    // @ts-ignore
    expect(Object.entries(Testable_WS_API.pendingRequests).length).toBe(0);

    expect(counter).toBe(4);
});

test('Test Base_WS_API handles unformatted messages properly', () => { // TODO WHY DOESN"T THIS ERROR H+GET CAUGHT
    try {
        //@ts-ignore
        Testable_WS_API.handleMessageFromServer("NOT JSON");
        expect(true).toBe(false);
    } catch (exception) {
        expect(true).toBe(true);
    }
});

test('Test Base_WS_API sendRequest make requests properly', async () => {
    const message = {
        type: WebsocketType.GameStart /* type is irrelevant */, 
        payload: {
            testVal: "test"
        }
    };

    Testable_WS_API.setUserToken("testToken");
    
    // stub out websockets
    // @ts-ignore
    global.WebSocket = MockWebSocket;

    const tmp = Testable_WS_API.setupWebSocketConnection();
    // @ts-ignore
    Testable_WS_API.socket?.onopen();
    await tmp;

    // attach a callback to the send method so we can intercept and check the values.
    // @ts-ignore
    Testable_WS_API.socket.send = (data: string) => {
        const parsedData = JSON.parse(data);

        expect(parsedData.type).toBe(message.type);
        expect(parsedData.data).toStrictEqual(message.payload);
        // expect(parsedData.requestId).toBe();
        expect(parsedData.token).toBe("testToken");
    };
    
    // @ts-ignore
    const pendingMesage = Testable_WS_API.sendRequest(message.type, message.payload);

    // check that we created a proper pending promise
    // @ts-ignore
    expect(Object.values(Testable_WS_API.pendingRequests).length).toBe(1);

    // complete the request
    // @ts-ignore
    Testable_WS_API.handleMessageFromServer(JSON.stringify({
        // @ts-ignore
        requestId: Object.keys(Testable_WS_API.pendingRequests)[0]
    }));
    await pendingMesage;

    // check that the request was removed from the queue
    // @ts-ignore
    expect(Object.values(Testable_WS_API.pendingRequests).length).toBe(0);
});

test('Test Base_WS_API sendRequest fails properly when connection is not established', async () => {
    const message = {
        type: WebsocketType.GameStart /* type is irrelevant */, 
        payload: {
            testVal: "test"
        }
    };

    Testable_WS_API.setUserToken("testToken");
    
    // @ts-ignore
    const response = await Testable_WS_API.sendRequest(message.type, {});

    expect(response.type).toBe(WebsocketType.Error);
    expect(response.data).toStrictEqual({
        error: "Attempted to send a message over a non-open socket",
        fatal: true
    });
});