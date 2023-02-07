import { shallowMount } from "@vue/test-utils";
import HomeView from "../src/views/HomeView.vue";
import { WS_API } from "../src/middleware/WS_API";
import { HTTP_API } from "../src/middleware/HTTP_API";
import { assert, vi, it } from 'vitest'
import { WebsocketType } from "../../shared/enums/WebsocketTypes";

it("Can only start a game with 2 or more people", async () => {
    const homeView = shallowMount(HomeView, {
        props: {
            players: [] // we don't care about number of players right now
        }
    });

    // stub out the websocket api to just return something that
    // is not an error
    // @ts-ignore
    HTTP_API.sendCreate = () => { return {type: 2, userToken: "testToken", gameID: "testGame"}};
    // @ts-ignore
    WS_API.setupWebSocketConnection = () => { return {type: 2, userToken: "testToken", gameID: "testGame"}};
    // @ts-ignore
    WS_API.sendCreateGameRequest = () => { return {type: 2, userToken: "testToken", gameID: "testGame"}};

    // click the next step button to start a game
    homeView.find("#gameButton").trigger('click');

    // wait for the async create to happen
    await new Promise(res => setTimeout(res, 100));
    
    // check that the game was "started"
    assert.equal(homeView.getCurrentComponent().setupState.gameCode, "testGame");
    
    // check that we can't click the button again
    assert.equal(homeView.getCurrentComponent().setupState.canGoNext, false);
    
    // add 2 players
    WS_API.sendMessageToCallbacks({
        type: WebsocketType.GameJoinAck,
        data: {}        
    });
    WS_API.sendMessageToCallbacks({
        type: WebsocketType.GameJoinAck,
        data: {}        
    });

    // check that now we can go next
    assert.equal(homeView.getCurrentComponent().setupState.canGoNext, true);

    // remove a player
    WS_API.sendMessageToCallbacks({
        type: WebsocketType.PlayerDisconnectAck,
        data: {}
    });
    
    // check that now we can't go next
    assert.equal(homeView.getCurrentComponent().setupState.canGoNext, false);
});