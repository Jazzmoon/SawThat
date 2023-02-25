import { shallowMount } from "@vue/test-utils";
import { WebsocketType } from "../../shared/enums/WebsocketTypes";
import App from "../src/App.vue";
import { WS_API } from "../src/middleware/WS_API";
import { assert, vi, it } from 'vitest'

it.each([
    [0, "HomeView"],
    [1, "MainView"],
    [2, "MultiChoiceQuestion"],
  ])("App renders proper screen when necessary", (state, page) => {
    const app = shallowMount(App);

    // switch game state
    // @ts-ignore
    app.getCurrentComponent().setupState.currentGameState = state;

    // check proper view shown
    // @ts-ignore
    assert.equal(app.getCurrentComponent().setupState.currentView, page);   
});

it.each([
    // start in none state
    [{type: WebsocketType.Error, data: {message: "test", fatal: true}}, 0, 0],
    [{type: WebsocketType.Error, data: {message: "test", fatal: false}}, 0, 0],
    // start in running state
    [{type: WebsocketType.Error, data: {message: "test", fatal: true}}, 1, 0],
    [{type: WebsocketType.Error, data: {message: "test", fatal: false}}, 1, 1],
    // start in answering state
    [{type: WebsocketType.Error, data: {message: "test", fatal: true}}, 2, 0],
    [{type: WebsocketType.Error, data: {message: "test", fatal: false}}, 2, 1],
  ])('App handles error messages properly (%s, %i, %i)', async (message, startState, expectedState) => {
    const app = shallowMount(App);

    // prevent alerts from being fired
    vi.stubGlobal('alert', vi.fn())

    // initial state should be NONE
    //@ts-ignore
    app.getCurrentComponent().setupState.currentGameState = startState;
    
    // send error message
    WS_API.sendMessageToCallbacks(message);

    // new state should be either none if fatal or stay the same if not fatal
    //@ts-ignore
    assert.equal(app.getCurrentComponent().setupState.currentGameState, expectedState);
    
});

it('App handles question messages properly', (message) => {
    const app = shallowMount(App);
    const dummyData = {data: 'test'};

    // run the game
    // @ts-ignore
    app.getCurrentComponent().setupState.currentGameState = 1;
    
    // send a question message
    WS_API.sendMessageToCallbacks({
        type: WebsocketType.QuestionAck,
        data: dummyData
    });
    
    // check that we are answering a question now
    // @ts-ignore
    assert.equal(app.getCurrentComponent().setupState.currentGameState, 2);
    // @ts-ignore
    assert.equal(JSON.stringify(app.getCurrentComponent().setupState.currentQuestionData), JSON.stringify(dummyData));
    
    // send question ended ack and show that a new player was added after the round
    // (simulate player movement in a lazy way basically)
    WS_API.sendMessageToCallbacks({
        type: WebsocketType.QuestionEndedAck,
        data: {players: [{username: 1, color: "red", position: 5}]}
    });
    
    // @ts-ignore
    assert.equal(app.getCurrentComponent().setupState.currentGameState, 1);
    // @ts-ignore
    assert.equal(app.getCurrentComponent().setupState.players.length, 1);
});

it('App handles player connection properly', (message) => {
    const app = shallowMount(App);

    // start with 0 players
    // @ts-ignore
    assert.equal(app.getCurrentComponent().setupState.players.length, 0);

    // send player join so we are at 1 player now
    WS_API.sendMessageToCallbacks({
        type: WebsocketType.GameJoinAck,
        data: {players: [{username: 1, color: "red", position: 5}]}
    });

    // check that at one player now
    // @ts-ignore
    assert.equal(app.getCurrentComponent().setupState.players.length, 1);

    // send player disconnect
    WS_API.sendMessageToCallbacks({
        type: WebsocketType.PlayerDisconnectAck,
        data: {players: []}
    });

    // check that still at one player now
    // @ts-ignore
    assert.equal(app.getCurrentComponent().setupState.players.length, 0);
});
