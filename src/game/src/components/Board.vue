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
import { onUpdated } from 'vue';
import PlayersListVue from "./PlayersList.vue";

const props = defineProps<{
    players: Player[],
    currentPlayerIndex: number
}>()

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
    for (const playerPosition of props.players) { // TODO HANDLE MULTIPLE PLAYERS ON SAME TILE
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