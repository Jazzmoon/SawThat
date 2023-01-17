<script lang="ts" setup>
import BoardVue from '@/components/Board.vue';

const props = defineProps<{
  players: Player[],
  currentPlayerIndex: number,
}>();
</script>

<template>
    <main>
       <BoardVue id="gameBoard" :players="props.players" :current-player-index="props.currentPlayerIndex"/>
    </main>
</template>

<style scoped>
#gameBoard {
    width: 100%;
    height: 100%;
    display: inline-flex;
    flex-direction: column;
}
</style>