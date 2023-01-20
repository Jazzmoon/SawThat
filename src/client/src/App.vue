<template>
  <HomeView v-if="!joined" @joined="joined = true" />
  <MultiChoiceQuestion v-else-if="answering" :question="currentQuestionText"/>
  <MainView v-else :players="players" :current-player-index="currentPlayerIndex"/>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { WebsocketType } from '../../shared/enums/WebsocketTypes';
import type { Player } from '../../shared/types/Player';
import type { WebsocketMessage } from '../../shared/types/Websocket';
import { WS_API } from './middleware/WS_API';
import HomeView from './views/HomeView.vue';
import MainView from './views/MainView.vue';
import MultiChoiceQuestion from './views/MultiChoiceQuestion.vue';

let joined = ref(false);
let answering = ref(false);
let currentQuestionText = ref("");
let consequenceShown = ref(false);
let players = ref([] as Player[]);
let currentPlayerIndex = ref(0);

const messageCallBackId = "App";
onMounted(() => {
  WS_API.addIncomingMessageCallback(messageCallBackId, (message: WebsocketMessage) => {
    switch (message.type) {
      case WebsocketType.Error:
        alert(message.data);
        break;
      case WebsocketType.TextQuestion: // this or ack?
      case WebsocketType.MultipleChoiceQuestion: // this or ack?
        answering.value = true;
        currentQuestionText = message.data.questionText; // todo is this correct?
        break;
      case WebsocketType.QuestionTimeOut: // this or ack?
      case WebsocketType.QuestionAnswer: // this or ack?
      case WebsocketType.QuestionEnded: // this or ack?
        answering.value = false;
        break;
      case WebsocketType.Consequence: // this or ack?
        consequenceShown.value = true; // todo get the consequence data and shoqw in a modal
        break;
      case WebsocketType.ConsequenceEnded: // this or ack?
        consequenceShown.value = false;
        break;
      case WebsocketType.GameEnded: // this or ack?
        joined.value = false; // todo add a leaderboard screen
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
