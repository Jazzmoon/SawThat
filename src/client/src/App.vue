<template>
  <transition name="fade" mode="out-in">
    <MultiChoiceQuestionView
      v-if="currentView == MultiChoiceQuestionView.__name"
      @answered="returnToBoard"
      :data="currentQuestionData"
    />
    <MainView
      v-else-if="currentView == MainView.__name"
      :players="players"
      :current-player-index="currentPlayer"
      :self-username="currentPlayerUsername"
    />
    <HomeView v-else @joined="returnToBoard" />
  </transition>
</template>

<script setup lang="ts">
import HomeView from "./views/HomeView.vue";
import MainView from "./views/MainView.vue";
import MultiChoiceQuestionView from "./views/MultiChoiceQuestion.vue";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { WebsocketType } from "../../shared/enums/WebsocketTypes";
import { WS_API } from "./middleware/WS_API";
import type { QuestionData } from "../../shared/apis/WebSocketAPIType";
import type { Player } from "../../shared/types/Player";
import type { WebsocketMessage } from "../../shared/types/Websocket";

// game state variables
enum GameState {
  NONE = 0, // game is not created or started yet
  RUNNING = 1, // game is running but not currently showing a question or consequence
  ANSWERING_QUESTION = 2, // game is running and showing a question
}
let currentGameState = ref(GameState.NONE);

let currentQuestionData = ref({} as QuestionData);
let players = ref([] as Player[]);
let currentPlayer = ref(-1);
let currentPlayerUsername = ref("");

const messageCallBackId = "App";

function returnToBoard(id: string) {
  currentGameState.value = GameState.RUNNING;
  if (currentPlayerUsername.value === "") {
    currentPlayerUsername.value = id;
  }
}

onMounted(() => {
  WS_API.addIncomingMessageCallback(
    messageCallBackId,
    (message: WebsocketMessage) => {
      switch (message.type) {
        case WebsocketType.Error:
          alert(JSON.stringify(message.data));
          if (message.data.fatal) {
            WS_API.resetConnection();
            currentGameState.value = GameState.NONE;
          } else {
            currentGameState.value = currentGameState.value === GameState.ANSWERING_QUESTION ? GameState.RUNNING : currentGameState.value;
          }
          break;
        case WebsocketType.QuestionAck:
          currentGameState.value = GameState.ANSWERING_QUESTION;
          currentQuestionData = message.data;
          break;
        case WebsocketType.QuestionTimeOut:
        case WebsocketType.QuestionAnswer:
        case WebsocketType.QuestionEndedAck:
          currentGameState.value = GameState.RUNNING;
          // if the list of players was updated, update it
          if (message.data.players) {
            players.value = message.data.players;
          }
          break;
        case WebsocketType.GameEndedAck:
          currentGameState.value = GameState.NONE;
          WS_API.resetConnection();
          break;
        // when the player list is updated
        case WebsocketType.GameJoinAck:
        case WebsocketType.PlayerDisconnectAck:
        case WebsocketType.NextPlayerAck:
          players.value = message.data.players;
          break;
      }
    }
  );
});

onUnmounted(() => {
  WS_API.removeIncomingMessageCallback(messageCallBackId);
});

// determines which view should be currently shown to the user
const currentView = computed(() => {
  switch (currentGameState.value) {
    case GameState.NONE:
      return HomeView.__name;
    case GameState.RUNNING:
      return MainView.__name;
    case GameState.ANSWERING_QUESTION:
      return MultiChoiceQuestionView.__name;
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
