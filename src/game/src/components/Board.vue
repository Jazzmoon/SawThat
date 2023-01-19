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
import { onMounted } from 'vue';
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
        playerPieces[player.name] = piece;
        startingSpot?.parentElement?.append(piece);

        updatePiecePosition(player);
    }
});

/**
 * Call this method to refresh the player pieces on the board
 */
function updatePlayerPositions() {
    for (const player of props.players) {
        if (playerPosition[player.name] !== player.position) {
            updatePiecePosition(player);
        }
    }
}

function updatePiecePosition(player: Player) : void {
    // remove player from previous tile and add them to the new one
    playersOnTile[playerPosition[player.name]]--;
    playersOnTile[player.position] = (playersOnTile[player.position] ?? 0) + 1;
    playerPosition[player.name] = player.position;

    // move the player's piece on the board. Note that if there are already players on this tile, we stack them up
    const newSpot = document.getElementById(`spot${player.position+1}`);
    playerPieces[player.name].setAttribute('cy', String(parseInt(newSpot?.getAttribute('cy')!) - 50 * (playersOnTile[player.position] - 1)));
    playerPieces[player.name].setAttribute('cx', newSpot?.getAttribute('cx')!);
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