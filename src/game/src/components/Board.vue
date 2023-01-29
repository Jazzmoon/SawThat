<template>
    <BoardSVG id="board"/>
</template>

<script lang="ts" setup>
import BoardSVG from "@/assets/board.svg?skipsvgo"; // load svg but don't optimize away id fields
import { onMounted } from 'vue';
import type { Player } from "../../../shared/types/Player";

const props = defineProps<{
    players: Player[],
    previousTurnPlayers: Player[]
    currentPlayerIndex: number
}>()

let playersOnTile: number[];
let startingSpot: HTMLElement | null;

onMounted(() => {
    // create the player pieces for each player and position at starting location
    startingSpot = document.getElementById("spot1");
    playersOnTile = Array(38).fill(0);
    for (const player of props.players) {
        const prevPlayersSpot = props.previousTurnPlayers.find((oldPlayer) => oldPlayer.username === player.username);
        createPiece(player, Math.max(0, Math.min(39, prevPlayersSpot?.position ?? 0)));
    }
});

function createPiece(player: Player, previousSpot: number): void {
    const piece = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    piece.setAttribute('r', startingSpot?.getAttribute('r')!);
    piece.setAttribute('fill', player.color);
    piece.classList.add("boardPiece");
    startingSpot?.parentElement?.append(piece);

    // place at previous location (since the view is recomputed entirely every time)
    playersOnTile[previousSpot]++;
    placePieceAtPosition(piece, previousSpot);

    // update to the new location (for the animation to play)
    // we clamp the max and min of the position to avoid flying off the board
    // 39 = final cut it lasts for multiple rounds
    // the 1s delay is to play the animation a bit later so everyone can see it
    setTimeout(() => {
        const position = Math.max(0, Math.min(player.position, 39));
        playersOnTile[previousSpot]--;
        playersOnTile[position]++;
        placePieceAtPosition(piece, position);
    }, 1000);
}

function placePieceAtPosition(piece: SVGCircleElement, position: number) {
    // move the player's piece on the board. Note that if there are already players on this tile, we stack them up
    const newSpot = document.getElementById(`spot${position+1}`);
    piece.setAttribute('cy', String(parseInt(newSpot?.getAttribute('cy')!) - 50 * (playersOnTile[position] - 1)));
    piece.setAttribute('cx', newSpot?.getAttribute('cx')!);
}

</script>

<style scoped>
#board {
    height: 100%;
    width: 100%;
}
</style>

<!-- Not scoped since we need this class to propogate into the svgs that we are creating -->
<style>
.boardPiece {
    transition: all .5s ease-in-out;
    stroke: black;
    stroke-width: 7px;
}
</style>