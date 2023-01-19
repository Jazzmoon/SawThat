<template>
  <HomeView v-if="!gameStarted" />
  <QuestionView v-else-if="questionShown" :question="questionText" :background-image-url="'TODO'"/>
  <MainView v-else :players="players" :current-player-index="currentPlayerIndex" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { WS_API } from './middleware/WS_API';
import HomeView from './views/HomeView.vue';
import MainView from './views/MainView.vue';
import QuestionView from './views/QuestionView.vue';
import type { Player } from "../../shared/types/types/Player";

let gameStarted = ref(false);
let questionShown = ref(false);

const messageCallBackId = "App";
onMounted(() => {
  // TODO UPDATE THIS TYPES TO BE CONSISTENT WITH SERVER
  WS_API.addIncomingMessageCallback(messageCallBackId, (data: any) => {
    switch (data.type) {
      case "error":
        alert(data.message); // TODO EXIT IF CONNECTION LOST (THIS IS A HARDCODED MESSAGE FROM WS_API)
        break;
      case "question":
        questionShown.value = true; // todo get the question data and pass to QuestionView
        break;
      case "answered":
        questionShown.value = false; // todo update the board in MainView with new player positions
        break;
    }
  });
});

onUnmounted(() => {
  WS_API.removeIncomingMessageCallback(messageCallBackId);
});

// TODO REMOVE THIS. IT IS FOR DUMMY DATA FOR TESTING
let players: Player[] = [
  {
    name: "Player 1",
    colour: "#003FA3",
    position: 1,
  },
  {
    name: "Player 2",
    colour: "#00A324",
    position: 7,
  },
  {
    name: "Player 3",
    colour: "#A30000",
    position: 2,
  },
  {
    name: "Player 4",
    colour: "#A39C00",
    position: 2,
  },
  {
    name: "Player 5",
    colour: "#A39C00",
    position: 2,
  },
  {
    name: "Player 6",
    colour: "#A30000",
    position: 2,
  },
  {
    name: "Player 7",
    colour: "#A39C00",
    position: 2,
  },
  {
    name: "Player 8",
    colour: "#A39C00",
    position: 2,
  }
];
let currentPlayerIndex = 0;
let questionText = "A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines";

</script>

<style scoped>

</style>
