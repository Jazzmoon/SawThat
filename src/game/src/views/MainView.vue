<template>
  <main>
     <BoardVue id="gameBoard" :players="props.players" :current-player-index="props.currentPlayerIndex"/>
  </main>
</template>

<script lang="ts" setup>
import BoardVue from '@/components/Board.vue';
import type { Player } from '../../../shared/types/Player';

const props = defineProps<{
  players: Player[],
  currentPlayerIndex: number,
}>();
</script>

<style scoped>
#gameBoard {
    width: 100%;
    height: 100%;
    display: inline-flex;
    flex-direction: column;
}
</style>