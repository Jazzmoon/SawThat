<template>
  <main>
      <div id="topSection">
        <PlayersListVue id="players" :players="props.players" :current-player-index="props.currentPlayerIndex" :shownIndex="true"/>
      </div>
     <BoardVue id="gameBoard" :players="props.players" :current-player-index="props.currentPlayerIndex"/>
  </main>
</template>

<script lang="ts" setup>
import BoardVue from '@/components/Board.vue';
import PlayersListVue from "@/components/PlayersList.vue";
import type { Player } from '../../../shared/types/Player';

const props = defineProps<{
  players: Player[],
  currentPlayerIndex: number
}>();
</script>

<style scoped>
#topSection {
    width: 100%;
}
#gameBoard {
    width: 100%;
    height: 100%;
    display: inline-flex;
    flex-direction: column;
}
</style>