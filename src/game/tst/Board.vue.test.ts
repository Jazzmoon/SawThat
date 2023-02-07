import { mount } from "@vue/test-utils";
import { WebsocketType } from "../../shared/enums/WebsocketTypes";
import Board from "../src/components/Board.vue";
import { WS_API } from "../src/middleware/WS_API";
import { assert, vi, it } from 'vitest'

it.each([
    [[], []], // test that an empty set if players does not break it
    [[{username: 0, position: 0, color: "red"}], [{username: 0, position: 1, color: "red"}]], // test 1 player moved up 1 tile
    [[{username: 0, position: 0, color: "red"}], []], // test 1 player removed
    [[], [{username: 0, position: 0, color: "red"}]], // test 1 player added
    [[{username: 0, position: 0, color: "red"}, {username: 1, position: 0, color: "blue"}], [{username: 0, position: 0, color: "red"}, {username: 1, position: 1, color: "blue"}]], // test 2 players start on same tile and 1 moves off
    [[{username: 0, position: 0, color: "red"}, {username: 1, position: 1, color: "blue"}], [{username: 0, position: 1, color: "red"}, {username: 1, position: 1, color: "blue"}]], // test 2 players start on different tiles and one moves to other
    [[{username: 0, position: 0, color: "red"}, {username: 1, position: 1, color: "blue"}], [{username: 0, position: 1, color: "red"}, {username: 1, position: 3, color: "blue"}]], // test 2 players start on different tiles and move independently
    [[{username: 0, position: 0, color: "red"}, {username: 1, position: 1, color: "blue"}], [{username: 0, position: -1, color: "red"}, {username: 1, position: 45, color: "blue"}]], // test 2 players one is negative position and other is overflowing position
])("Board places pieces properly (%s, %s)", async (playersBefore, playersAfter) => {
    const board = mount(Board, {
        props: {
            players: playersAfter,
            previousTurnPlayers: playersBefore,
            currentPlayerIndex: 0 // irrelevant
        }
    });

    // check that all the pieces are in the right place unfortunately we can't test
    // color and usernames as those properties are not exposed by vitest
    if (playersBefore.length > 0 && playersAfter.length > 0) {
        const expectedBefore = Array(38).fill(0);
        for (const player of playersBefore) {
            expectedBefore[Math.max(0, Math.min(39, player.position))]++;
        }
        assert.deepEqual(board.getCurrentComponent().setupState.playersOnTile, expectedBefore);
    }

    // wait for animation to finish
    await new Promise(res => setTimeout(res, 1100));

    // check that all the pieces are in the right place unfortunately we can't test
    // color and usernames as those properties are not exposed by vitest
    if (playersBefore.length > 0 && playersAfter.length > 0) {
        const expectedAfter = Array(38).fill(0);
        for (const player of playersAfter) {
            expectedAfter[Math.max(0, Math.min(39, player.position))]++;
        }
        assert.deepEqual(board.getCurrentComponent().setupState.playersOnTile, expectedAfter);
    }
});