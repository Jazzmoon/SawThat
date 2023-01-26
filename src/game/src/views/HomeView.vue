<script setup lang="ts">
import LogoSVG from "@/assets/logo.svg?component";
import PlayersListVue from "@/components/PlayersList.vue";
import { HTTP_API } from "@/middleware/HTTP_API";
import { WS_API } from "@/middleware/WS_API";
import { computed, ref, watch } from "vue";
import { WebsocketType } from "../../../shared/enums/WebsocketTypes";
import type { Player } from "../../../shared/types/Player";

const props = defineProps<{
  players: Player[];
}>();

const emit = defineEmits(["gameStarted"]);

const gameCode = ref("");

/**
 * Helper function to decide what text to show on the button that
 * creates and starts the game.
 */
const buttonText = computed(() => {
  return isGameCreated() ? "Start Game" : "Create A New Game";
});

/**
 * Helper function to determine if a game has been created.
 */
function isGameCreated() {
  return gameCode.value.length !== 0;
}

/**
 * Copies the game code to the user's clipboard.
 */
function copyCode() {
  if (!isGameCreated()) {
    return;
  }
  navigator.clipboard.writeText(gameCode.value);
  alert("Copied game code to clipboard.");
}

/**
 * Helper to allow the same button to create and then start the game.
 */
async function nextSetupStep() {
  if (!isGameCreated()) {
    await createGame();
  } else {
    await startGame();
  }
}

/**
 * Creates a new game with the server that client nodes can then join.
 */
async function createGame() {
  const requestResult = await HTTP_API.sendCreate("disney"); // todo let the user decide this
  if (!requestResult || requestResult.hasOwnProperty("error")) {
    alert(`Failed to create a new game.\n${JSON.stringify(requestResult)}`);
    return;
  } else {
    gameCode.value = requestResult.gameID;
  }

  WS_API.setUserToken(requestResult.userToken);

  // setup the websocket connection
  const requestSuccess = await WS_API.setupWebSocketConnection(gameCode.value);

  if (!requestSuccess) {
    alert(
      "An error occurred while trying to upgrade the connection with the server."
    );
    return;
  }

  const request2Success = await WS_API.sendCreateGameRequest();

  if (!request2Success || request2Success.type === WebsocketType.Error) {
    alert(
      `An error occurred while trying to create the game.${request2Success.data}`
    );
    return;
  }

  // Disable start button since there are no players at first.
  document.getElementById("gameCode")?.setAttribute("disabled", "true");
  // Update start button whenever a player joins or disconnects.
  WS_API.addIncomingMessageCallback("checkPlayerCount", (message) => {
    switch (message.type) {
      case WebsocketType.PlayerDisconnectAck:
      case WebsocketType.GameJoinAck:
        console.log("Player joined/disconnected");
        document
          .getElementById("gameCode")
          ?.setAttribute(
            "disabled",
            props.players.length > 1 ? "false" : "true"
          );
      default:
        break;
    }
  });
}

/**
 * Notifies server to start the game and then transitions the game node
 * display to the game board
 */
async function startGame() {
  const request2Success = await WS_API.sendStartGameRequest();

  if (!request2Success || request2Success.type === WebsocketType.Error) {
    alert(
      `An error occurred while trying to start the game.${request2Success.data}`
    );
    return;
  }

  emit("gameStarted");
  WS_API.removeIncomingMessageCallback("checkPlayerCount");
}
</script>

<template>
  <main>
    <div id="root">
      <div id="left">
        <LogoSVG id="icon" />
        <h1 id="title">SawThat?</h1>
        <div v-if="gameCode">
          <p>Game Code (Click to Copy):</p>
          <button id="gameCode" @click="copyCode()">{{ gameCode }}</button>
          <p>
            Go to
            {{ /*import.meta.env.DOMAIN*/ "https://sawthat.jazzmoon.host/" }}
            and enter this code to join!
          </p>
        </div>
        <button @click="nextSetupStep()">{{ buttonText }}</button>
      </div>
      <div id="right" v-if="gameCode">
        <h2>Who's already here:</h2>
        <PlayersListVue
          id="players"
          :players="props.players"
          :currentPlayer="null"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
#root {
  display: flex;
  flex-direction: row;
}
#title {
  font-family: "Fredericka the Great";
  text-align: center;
  font-weight: 100;
  font-size: 5rem;
  margin-bottom: 50px;
}
#icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 48px;
  max-width: 500px;
  min-width: 50px;
  width: 20vmin;
}
#gameCode {
  width: fit-content;
  margin: auto;
  color: white;
  background-color: #003fa3;
  border-radius: 30px;
}
#right {
  display: inline-block;
  margin-left: 48px;
  width: 100%;
}

button {
  border: 1rem solid #003fa3;
  border-radius: 30px;
  margin: 8px;
  color: white;
  text-align: center;
  background-color: #003fa3;
  min-width: 120px;
}

button:disabled {
  border: 1rem solid #778db1;
  background-color: #778db1;
}
</style>
