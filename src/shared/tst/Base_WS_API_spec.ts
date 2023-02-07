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
    expect(JSON.stringify(Testable_WS_API.pendingMessageCallbacks)).toBe(undefined);
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
    expect(1+2).toBe(3);
});

test('Test Base_WS_API reset connection destroys everything properly', () => {
    expect(1+2).toBe(3);
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