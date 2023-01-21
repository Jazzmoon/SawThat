<template>
    <div>
        <div id="top">
            <PlayersListVue id="players" :players="props.players" :currentPlayer="props.currentPlayerIndex"/>
        </div>
        <BoardSVG id="board"/>
    </div>
</template>

<script lang="ts" setup>
import BoardSVG from "@/assets/board.svg?skipsvgo"; // load svg but don't optimize away id fields
import { onMounted, watch } from 'vue';
import type { Player } from "../../../shared/types/Player";
import PlayersListVue from "./PlayersList.vue";

const props = defineProps<{
    players: Player[],
    currentPlayerIndex: number
}>()

let playerPieces: Record<string, SVGCircleElement> = {};
let playerPosition: Record<string, number> = {};
let playersOnTile: Record<number, number> = {};

onMounted(() => {
    // create the player pieces for each player and position at starting location
    const startingSpot = document.getElementById("spot1");
    playersOnTile[0] = 0;
    for (const player of props.players) {
        const piece = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        piece.setAttribute('r', startingSpot?.getAttribute('r')!);
        piece.setAttribute('stroke', "black");
        piece.setAttribute('stroke-width', "7px");
        piece.setAttribute('fill', player.colour);
        playerPieces[player.username] = piece;
        startingSpot?.parentElement?.append(piece);

        updatePiecePosition(player);
    }
});

watch(props.players, async (n, o) => {
    for (const player of props.players) {
        if (playerPosition[player.username] !== player.position) {
            updatePiecePosition(player);
        }
    }
});

function updatePiecePosition(player: Player) : void {
    // remove player from previous tile and add them to the new one
    playersOnTile[playerPosition[player.username]]--;
    playersOnTile[player.position] = (playersOnTile[player.position] ?? 0) + 1;
    playerPosition[player.username] = player.position;

    // move the player's piece on the board. Note that if there are already players on this tile, we stack them up
    const newSpot = document.getElementById(`spot${player.position+1}`);
    playerPieces[player.username].setAttribute('cy', String(parseInt(newSpot?.getAttribute('cy')!) - 50 * (playersOnTile[player.position] - 1)));
    playerPieces[player.username].setAttribute('cx', newSpot?.getAttribute('cx')!);
}
</script>

<style scoped>
#top {
    width: 100%;
}
#board {
    height: 100%;
    width: 100%;
}
</style>