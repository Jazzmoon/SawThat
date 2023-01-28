<template>
    <BoardSVG id="board"/>
</template>

<script lang="ts" setup>
import BoardSVG from "@/assets/board.svg?skipsvgo"; // load svg but don't optimize away id fields
import { onMounted, watch } from 'vue';
import type { Player } from "../../../shared/types/Player";

const props = defineProps<{
    players: Player[],
    previousTurnPlayers: Player[]
    currentPlayerIndex: number
}>()

let playerPieces: Record<string, {piece: SVGCircleElement, position: number}> = {};
let playersOnTile: number[] = Array(38).fill(0);
let startingSpot: HTMLElement | null;

onMounted(() => {
    // create the player pieces for each player and position at starting location
    startingSpot = document.getElementById("spot1");
    for (const player of props.players) {
        const prevPlayersSpot = props.previousTurnPlayers.find((oldPlayer) => oldPlayer.username === player.username);
        createPiece(player, prevPlayersSpot?.position ?? 0);
    }
});

function createPiece(player: Player, previousSpot: number): void {
    const piece = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    piece.setAttribute('r', startingSpot?.getAttribute('r')!);
    piece.setAttribute('fill', player.color);
    piece.classList.add("boardPiece");
    startingSpot?.parentElement?.append(piece);
    
    // set to the previous location
    playerPieces[player.username] = {piece: piece, position:  Math.max(0, previousSpot)};
    playersOnTile[previousSpot]++;
    
    // update to the new location (for the animation to play)
    updatePiecePosition(player);
}

function updatePiecePosition(player: Player): void {
    const playerPiece = playerPieces[player.username];
    const position = Math.max(0, player.position);
    // remove player from previous tile and add them to the new one
    playersOnTile[playerPiece.position]--;
    playersOnTile[position]++;
    playerPiece.position = position;

    // move the player's piece on the board. Note that if there are already players on this tile, we stack them up
    const newSpot = document.getElementById(`spot${position+1}`);
    playerPiece.piece.setAttribute('cy', String(parseInt(newSpot?.getAttribute('cy')!) - 50 * (playersOnTile[position] - 1)));
    playerPiece.piece.setAttribute('cx', newSpot?.getAttribute('cx')!);
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