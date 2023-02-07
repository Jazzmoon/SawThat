import { shallowMount } from "@vue/test-utils";
import { WebsocketType } from "../../shared/enums/WebsocketTypes";
import App from "../src/App.vue";
import { WS_API } from "../src/middleware/WS_API";
import { assert, vi, it } from 'vitest'

it("Can only start a game with 2 or more people", () => {
    // TODO I need to stub out all the IO stuff

});