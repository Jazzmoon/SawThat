<template>
  <HomeView v-if="!joined" @joined="joined = true" />
  <MultiChoiceQuestion v-else-if="answering" @answered="answering = false" :data="currentQuestionData"/>
  <MainView v-else :players="players" :current-player-index="currentPlayerIndex"/>
</template>

<script setup lang="ts">
import type { QuestionData } from "../../shared/apis/WebSocketAPIType"
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
let currentQuestionData = ref({} as QuestionData);
let consequenceShown = ref(false);
let players = ref([] as Player[]);
let currentPlayerIndex = ref(0);

const messageCallBackId = "App";
onMounted(() => {
  WS_API.addIncomingMessageCallback(messageCallBackId, (message: WebsocketMessage) => {
    switch (message.type) {
      case WebsocketType.Error:
        alert(JSON.stringify(message.data));
        break;
      case WebsocketType.QuestionRequest:
        answering.value = true;
        currentQuestionData = message.data;
        break;
      case WebsocketType.QuestionTimeOut:
      case WebsocketType.QuestionAnswer:
      case WebsocketType.QuestionEndedAck:
        answering.value = false;
        break;
      case WebsocketType.ConsequenceAck:
        consequenceShown.value = true; // todo get the consequence data and shoqw in a modal
        break;
      case WebsocketType.ConsequenceEndedAck:
        consequenceShown.value = false;
        break;
      case WebsocketType.GameEndedAck:
        joined.value = false; // todo add a leaderboard screen
        break;
      case WebsocketType.GameJoinAck:
        players.value = message.data.players;
        break;
      case WebsocketType.PlayerDisconnectAck:
      const index = players.value.findIndex((player) => player.username === message.data.username);
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
