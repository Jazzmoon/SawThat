<template>
  <HomeView v-if="!gameStarted" :players="players" />
  <QuestionView v-else-if="questionShown" :question="currentQuestionText" :background-image-url="'TODO'"/>
  <MainView v-else :players="players" :current-player-index="currentPlayerIndex" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { WS_API } from './middleware/WS_API';
import HomeView from './views/HomeView.vue';
import MainView from './views/MainView.vue';
import QuestionView from './views/QuestionView.vue';
import type { Player } from "../../shared/types/Player";
import { WebsocketType } from '../../shared/enums/WebsocketTypes';
import type { WebsocketMessage } from '../../shared/types/Websocket';

// game state variables
let players = ref([] as Player[]);
let currentPlayerIndex = ref(0);
let currentQuestionText = ref("");
let gameStarted = ref(false);
let questionShown = ref(false);
let consequenceShown = ref(false);

const messageCallBackId = "App";
onMounted(() => {
  WS_API.addIncomingMessageCallback(messageCallBackId, (message: WebsocketMessage) => {
    switch (message.type) {
      case WebsocketType.Error:
        alert(message.data);
        break;
      case WebsocketType.TextQuestion: // this or ack?
      case WebsocketType.MultipleChoiceQuestion: // this or ack?
        questionShown.value = true;
        currentQuestionText = message.data.questionText; // todo is this correct?
        break;
      case WebsocketType.QuestionTimeOut: // this or ack?
      case WebsocketType.QuestionAnswer: // this or ack?
      case WebsocketType.QuestionEnded: // this or ack?
        questionShown.value = false;
        break;
      case WebsocketType.Consequence: // this or ack?
        consequenceShown.value = true; // todo get the consequence data and shoqw in a modal
        break;
      case WebsocketType.ConsequenceEnded: // this or ack?
        consequenceShown.value = false;
        break;
      case WebsocketType.GameEnded: // this or ack?
        gameStarted.value = false; // todo add a leaderboard screen
        break;
      case WebsocketType.GameJoin: // this or ack?
        players.value.push(message.data); // todo is this correct?
        break;
      case WebsocketType.PlayerDisconnectAck:
        players.value.splice(players.value.findIndex(message.data.userId), 1);
        break;
      // todo handle timer and the other cases in the views where they are applicable
    }
  });
});

onUnmounted(() => {
  WS_API.removeIncomingMessageCallback(messageCallBackId);
});

</script>

<style scoped>

</style>
