import { shallowMount } from "@vue/test-utils";
import { WebsocketType } from "../../shared/enums/WebsocketTypes";
import App from "../src/App.vue";
import { WS_API } from "../src/middleware/WS_API";
import { assert, vi, it } from 'vitest'

// TODO