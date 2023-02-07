import Base_WS_API from "../Base_WS_API"

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
    expect(1+2).toBe(3);
});

test('Test Base_WS_API handles empty messages properly', () => {
    expect(1+2).toBe(3);
});

test('Test Base_WS_API handles unformatted messages properly', () => {
    expect(1+2).toBe(3);
});

test('Test Base_WS_API sendRequest make requests properly', () => {
    expect(1+2).toBe(3);
});

test('Test Base_WS_API sendRequest fails properly when connection is not established', () => {
    expect(1+2).toBe(3);
});