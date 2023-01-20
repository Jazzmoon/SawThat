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
      case WebsocketType.TextQuestion:
      case WebsocketType.MultipleChoiceQuestion:
        questionShown.value = true;
        currentQuestionText = message.data.questionText; // todo is this correct?
        break;
      case WebsocketType.QuestionTimeOut:
      case WebsocketType.QuestionAnswer:
      case WebsocketType.QuestionEndedAck:
        questionShown.value = false;
        break;
      case WebsocketType.ConsequenceAck:
        consequenceShown.value = true; // todo get the consequence data and shoqw in a modal
        break;
      case WebsocketType.ConsequenceEndedAck: 
        consequenceShown.value = false;
        break;
      case WebsocketType.GameEndedAck:
        gameStarted.value = false; // todo add a leaderboard screen
        break;
      case WebsocketType.GameJoinAck:
        if (message.data.userType === "Client") {
          players.value.push({
            name: message.data.username,
            position: 0,
            colour: 'red'
          }); // todo mark should send this stuff to me instead of I making it randomly here
        }
        break;
      case WebsocketType.PlayerDisconnectAck:
        const index = players.value.findIndex(message.data.userId);
        if (index > -1) {
          players.value.splice(index, 1);
        }
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
