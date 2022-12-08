<template>
    <div>
        <div id="top">
            <PlayersListVue id="players" :players="players" :currentPlayer="currentPlayer"/>
        </div>
        <BoardSVG id="board"/>
    </div>
</template>

<script lang="ts" setup>
import BoardSVG from "@/assets/board.svg?skipsvgo"; // load svg but don't optimize away id fields
import { onUpdated } from 'vue';
import PlayersListVue from "./PlayersList.vue";

let players: Player[] = [
    {
        name: "Player 1",
        color: "#003FA3",
        position: 2,
    },
    {
        name: "Player 2",
        color: "#00A324",
        position: 20,
    },
    {
        name: "Player 3",
        color: "#A30000",
        position: 12,
    },
    {
        name: "Player 4",
        color: "#A39C00",
        position: 14,
    },
    {
        name: "Player 5",
        color: "#A39C00",
        position: 30,
    },        
    {
        name: "Player 3",
        color: "#A30000",
        position: 13,
    },
    {
        name: "Player 4",
        color: "#A39C00",
        position: 7,
    },
    {
        name: "Player 5",
        color: "#A39C00",
        position: 9,
    },        
    {
        name: "Player 4",
        color: "#A39C00",
        position: 3
    },
];

let currentPlayer = 0;

let previousPlayerPositions: number[] = [];

// TODO MIGHT NEED TO UPDATE THE PARTICULAR CALLBACK FUNCTION THAT WE USE BUT THE LOGIC WORKS
onUpdated(() => {
    // cleanup old player positions
    for (const playerPosition of previousPlayerPositions) {
        const tile = document.getElementById(`spot${playerPosition}`)
        if (tile){
            tile.style.fill = 'unset';
        }
    }
    
    // clear array
    previousPlayerPositions = []

    // loop through the player positions list and update the board tiles (tiles indexed at 1)
    for (const playerPosition of players) { // TODO HANDLE MULTIPLE PLAYERS ON SAME TILE
        const tile = document.getElementById(`spot${playerPosition.position}`)
        if (tile){
            tile.style.fill = playerPosition.color;
        }
        previousPlayerPositions.push(playerPosition.position);
    }
});

</script>

<style scoped>
#top {
    height: 300px;
    width: 100%;
}
#board {
    height: 100%;
    width: 100%;
}
</style>