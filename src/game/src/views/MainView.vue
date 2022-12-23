<script lang="ts" setup>
import BoardVue from '@/components/Board.vue';

let players: Player[] = [
  {
    name: "Player 1",
    color: "#003FA3",
    position: 1,
  },
  {
    name: "Player 2",
    color: "#00A324",
    position: 10,
  },
  {
    name: "Player 3",
    color: "#A30000",
    position: 12,
  },
  {
    name: "Player 4",
    color: "#A39C00",
    position: 6,
  },
  {
    name: "Player 5",
    color: "#A39C00",
    position: 24,
  },
  {
    name: "Player 6",
    color: "#A30000",
    position: 21,
  },
  {
    name: "Player 7",
    color: "#A39C00",
    position: 13,
  },
  {
    name: "Player 8",
    color: "#A39C00",
    position: 4,
  }
];

let currentPlayerIndex = 0;
</script>

<template>
    <main>
       <BoardVue id="gameBoard" :players="players" :current-player-index="currentPlayerIndex"/>
    </main>
</template>

<style scoped>
#gameBoard {
    width: 100%;
}
</style>