<template>
    <div>
        <div id="topSection">
            <PlayersListVue id="players" :players="props.players" :current-player-index="props.currentPlayerIndex" :shownIndex="true"/>
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

let playerPieces: Record<string, {piece: SVGCircleElement, position: number}> = {};
let playersOnTile: number[] = Array(38).fill(0);

let playersWithPieces: Set<string> = new Set();

let startingSpot: HTMLElement | null;

onMounted(() => {
    // create the player pieces for each player and position at starting location
    startingSpot = document.getElementById("spot1");
    for (const player of props.players) {
        createPiece(player);
    }
});

watch(props.players, async (n, o) => {
    let currentPlayers = new Set<string>();
    for (const player of props.players) {
        currentPlayers.add(player.username);

        // if there is no piece for this player, create one
        if (playerPieces[player.username] === undefined) {
            createPiece(player);

        // if the position of the piece is wrong, update it
        } else if (playerPieces[player.username].position !== player.position) {
            updatePiecePosition(player);
        }
    }

    // remove pieces for players that have left the game
    const removedPlayers = new Set(Array.from(playersWithPieces).filter(player => !currentPlayers.has(player)));
    for (const player of removedPlayers) {
        const position = Math.max(0, playerPieces[player].position);
        playersOnTile[position]--;
        delete playerPieces[player];
    }

    // update the list of players
    playersWithPieces.clear();
    playersWithPieces = currentPlayers;
});

function createPiece(player: Player): void {
    const piece = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    piece.setAttribute('r', startingSpot?.getAttribute('r')!);
    piece.setAttribute('fill', player.color);
    piece.classList.add("boardPiece");
    startingSpot?.parentElement?.append(piece);

    playersWithPieces.add(player.username);
    
    const position = Math.max(0, player.position);
    playerPieces[player.username] = {piece: piece, position:  Math.max(0, position)};
    playersOnTile[position]++;
    
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
#topSection {
    width: 100%;
}
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