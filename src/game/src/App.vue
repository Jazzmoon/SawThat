<template>
  <div id="root">
    <ConsequenceModal v-if="consequenceShown" 
      :data="consequenceData" />
    <transition name="fade" mode="out-in">
      <FinalStandings v-if="currentView == FinalStandings.__name" 
        @close="currentGameState = GameState.NONE" 
        :top3-players="topPlayers" />
      <QuestionView v-else-if="currentView == QuestionView.__name" 
        :data="currentQuestionData" />
      <MainView v-else-if="currentView == MainView.__name" 
        :players="players"
        :previous-turn-players="previousTurnPlayers"
        :current-player-index="currentPlayer"/>
      <HomeView v-else :players="players" 
        @game-started="currentGameState = GameState.RUNNING" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import HomeView from './views/HomeView.vue';
import MainView from './views/MainView.vue';
import QuestionView from './views/QuestionView.vue';
import ConsequenceModal from './components/ConsequenceModal.vue';
import FinalStandings from './views/FinalStandings.vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { WS_API } from './middleware/WS_API';
import { WebsocketType } from '../../shared/enums/WebsocketTypes';
import type { Player } from "../../shared/types/Player";
import type { WebsocketMessage } from '../../shared/types/Websocket';
import type { ConsequenceData, QuestionData } from '../../shared/apis/WebSocketAPIType';

// game state variables
enum GameState {
  NONE = 0, // game is not created or started yet
  RUNNING = 1, // game is running but not currently showing a question or consequence
  SHOWING_QUESTION = 2, // game is running and showing a question
  ENDED = 3// game has ended but not yet returned to the home screen
}

let topPlayers = ref([] as Player[]);
let currentGameState = ref(GameState.NONE);
let players = ref([] as Player[]);
let previousTurnPlayers = ref([] as Player[]);
let currentQuestionData = ref({} as QuestionData);
let consequenceShown = ref(false);
let consequenceData = ref({} as ConsequenceData);
let currentPlayer = ref(-1);

const messageCallBackId = "App";
onMounted(() => {
  WS_API.addIncomingMessageCallback(messageCallBackId, (message: WebsocketMessage) => {
    switch (message.type) {
      case WebsocketType.Error:
        if (message.data.fatal) {
          alert(`A fatal error has occured when trying to communicate with the server:\n${message.data.message}\nServer's response: ${JSON.stringify(message.data)}`);
          WS_API.resetConnection();
          currentGameState.value = GameState.NONE;
        } else {
          alert(`An error has occured when trying to communicate with the server:\n${message.data.message}\nServer's response: ${JSON.stringify(message.data)}`);
          currentGameState.value = currentGameState.value === GameState.SHOWING_QUESTION ? GameState.RUNNING : currentGameState.value;
        }
        break;
      case WebsocketType.QuestionAck:
        currentQuestionData = message.data;
        currentGameState.value = GameState.SHOWING_QUESTION;
        break;
      case WebsocketType.QuestionTimeOut:
      case WebsocketType.QuestionAnswer:
      case WebsocketType.QuestionEndedAck:
        completeGameStep(message);
        currentGameState.value = GameState.RUNNING;
        break;
      case WebsocketType.ConsequenceAck:
        consequenceShown.value = true;
        consequenceData.value = message.data;
        break;
      case WebsocketType.ConsequenceEndedAck:
        completeGameStep(message);
        consequenceShown.value = false;
        break;
      case WebsocketType.GameEndedAck:
        topPlayers.value = message.data.ranking;
        currentGameState.value = GameState.ENDED;
        WS_API.resetConnection();
        break;
      case WebsocketType.GameJoinAck:
        updatePlayersList(message.data.players);
        break;
      case WebsocketType.PlayerDisconnectAck:
        const index = players.value.findIndex((player) => player.username === message.data.username);
        if (index > -1) {
          players.value.splice(index, 1);
        }
        break;
      case WebsocketType.NextPlayerAck:
        currentPlayer.value = players.value.findIndex(
          (player) => player.username === message.data.player.username
        );
        break;
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
    case GameState.ENDED:
      return FinalStandings.__name;
    case GameState.RUNNING:
      return MainView.__name;
    case GameState.SHOWING_QUESTION:
      return QuestionView.__name;
  }
})

function completeGameStep(message: WebsocketMessage): void {
  // if the list of players was updated, update it
  if (message.data.players) {
    updatePlayersList(message.data.players);
  }
  // start a timer for 5 seconds so that players can see the new standings. Then request a new question from the server
  setTimeout(() => {
    WS_API.sendNextQuestionRequest();
  }, 7000 /* 7 seconds */);
}

function updatePlayersList(newPlayers: Player[]): void {
  previousTurnPlayers.value = players.value;
  players.value = newPlayers;
}
</script>

<style scoped>
#root {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
