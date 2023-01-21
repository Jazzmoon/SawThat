<template>
    <div id="players">
        <div v-for="(player, index) in props.players" :key="player.username" :class="['player', (props.currentPlayer !== null && props.currentPlayer === index) ? 'chosen' : '']">
            <div class="colorIndicator" :style="`border-color: ${player.color}`"></div>
            <p class="playerName">{{player.username}}</p>
        </div>
    </div>
</template>

<script setup lang="ts">import type { Player } from '../../../shared/types/Player';

const props = defineProps<{
    players: Player[],
    currentPlayer: number | null
}>();
</script>

<style>
#players {
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.player {
    height: 50px;
    margin: 0 6px;
    display: flex;
    flex-direction: row;
    padding: 6px;
}


.colorIndicator {
    border: 10px solid #fff;
    border-radius: 50%;
    background-color: transparent;
    height: 15px;
    width: 15px;
    margin-top: 7px;
}

.playerName {
    color: white;
    line-height: 50px;
    vertical-align: middle;
    margin: 0;
    margin-left: 12px;
}

.player.chosen {
    border-radius: 15px;
    border: 5px solid #003fa3;
}
</style>