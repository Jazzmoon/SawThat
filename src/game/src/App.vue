<template>
  <div id="root">
    <ConsequenceModal v-if="consequenceShown" :message="consequenceMessage" />
    <HomeView v-if="!gameStarted" :players="players" />
    <QuestionView v-else-if="questionShown" :question="currentQuestionText" :background-image-url="'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.bwallpaperhd.com%2Fwp-content%2Fuploads%2F2019%2F06%2FWestDam.jpg&f=1&nofb=1&ipt=797b6bf5e9cb70fd5f4f9bb602c60d10fccc3aa35e5d09dc0a62e5a3dfd5c14c&ipo=images'"/>
    <MainView v-else :players="players" :current-player-index="currentPlayerIndex" />
  </div>
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
import ConsequenceModal from './components/ConsequenceModal.vue';

// game state variables
let players = ref([] as Player[]);
let currentPlayerIndex = ref(0);
let currentQuestionText = ref("");
let gameStarted = ref(false);
let questionShown = ref(false);
let consequenceShown = ref(false);
let consequenceMessage = ref("");

const messageCallBackId = "App";
onMounted(() => {
  WS_API.addIncomingMessageCallback(messageCallBackId, (message: WebsocketMessage) => {
    switch (message.type) {
      case WebsocketType.Error:
        alert(JSON.stringify(message.data));
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
        consequenceShown.value = true;
        consequenceMessage.value = message.data.consequence;
        break;
      case WebsocketType.ConsequenceEndedAck: 
        consequenceShown.value = false;
        break;
      case WebsocketType.GameEndedAck:
        gameStarted.value = false; // todo add a leaderboard screen
        break;
      case WebsocketType.GameJoinAck:
        players.value.push(message.data);
        break;
      case WebsocketType.PlayerDisconnectAck:
        const index = players.value.findIndex(message.data.username);
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
#root {
  height: 100%;
  width: 100%
}
</style>
