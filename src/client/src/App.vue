<template>
  <MultiChoiceQuestionView v-if="currentView == MultiChoiceQuestionView.__name" 
    @answered="currentGameState = GameState.RUNNING" 
    :data="currentQuestionData"/>
  <MainView v-else-if="currentView == MainView.__name" 
    :players="players" 
    :current-player-index="currentPlayerIndex"/>
  <HomeView v-else 
    @joined="currentGameState = GameState.RUNNING" />
</template>

<script setup lang="ts">
import HomeView from './views/HomeView.vue';
import MainView from './views/MainView.vue';
import MultiChoiceQuestionView from './views/MultiChoiceQuestion.vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { WebsocketType } from '../../shared/enums/WebsocketTypes';
import { WS_API } from './middleware/WS_API';
import type { QuestionData } from "../../shared/apis/WebSocketAPIType"
import type { Player } from '../../shared/types/Player';
import type { WebsocketMessage } from '../../shared/types/Websocket';

// game state variables
enum GameState {
  NONE = 0, // game is not created or started yet
  RUNNING = 1, // game is running but not currently showing a question or consequence
  ANSWERING_QUESTION = 2, // game is running and showing a question
}
let currentGameState = ref(GameState.NONE);

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
        currentGameState.value = GameState.ANSWERING_QUESTION;
        currentQuestionData = message.data;
        break;
      case WebsocketType.QuestionTimeOut:
      case WebsocketType.QuestionAnswer:
      case WebsocketType.QuestionEndedAck:
      currentGameState.value = GameState.RUNNING;
        break;
      case WebsocketType.ConsequenceAck:
        consequenceShown.value = true; // todo get the consequence data and shoqw in a modal
        break;
      case WebsocketType.ConsequenceEndedAck:
        consequenceShown.value = false;
        break;
      case WebsocketType.GameEndedAck:
        currentGameState.value = GameState.NONE;
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

// determines which view should be currently shown to the user
const currentView = computed(() => {
  switch(currentGameState.value) {
    case GameState.NONE:
      return HomeView.__name;
    case GameState.RUNNING:
      return MainView.__name;
    case GameState.ANSWERING_QUESTION:
      return MultiChoiceQuestionView.__name;
  }
})

</script>

<style scoped>

</style>
