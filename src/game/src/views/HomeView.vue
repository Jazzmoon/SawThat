<script setup lang="ts">
import LogoSVG from "@/assets/logo.svg?component";
import PlayersListVue from "@/components/PlayersList.vue";
import { HTTP_API } from "@/middleware/HTTP_API";
import { WS_API } from "@/middleware/WS_API";
import { computed, ref } from "vue";
import type { Player } from "../../../shared/types/Player";

const emit = defineEmits(['gameStarted']);

let userToken = "";
const gameCode = ref("");

let players: Player[] = [
  {
    name: "Player 1",
    colour: "#003FA3",
    position: 1,
  },
  {
    name: "Player 2",
    colour: "#00A324",
    position: 10,
  },
  {
    name: "Player 3",
    colour: "#A30000",
    position: 12,
  },
  {
    name: "Player 4",
    colour: "#A39C00",
    position: 6,
  },
  {
    name: "Player 5",
    colour: "#A39C00",
    position: 24,
  },
  {
    name: "Player 6",
    colour: "#A30000",
    position: 21,
  },
  {
    name: "Player 7",
    colour: "#A39C00",
    position: 13,
  },
  {
    name: "Player 8",
    colour: "#A39C00",
    position: 4,
  }
];

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
 * Copies the gamecode to the user's clipboard.
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

  if (!requestResult.error) {
    alert("Failed to create a new game.")
  } else {
    gameCode.value = requestResult.gameID;
    userToken = requestResult.userToken;
  }
}

/**
 * Notifies server to start the game and then transitions the game node
 * display to the game board
 */
// TODO TEST THESE AND/OR ADJUST AS NECESSARY
async function startGame() {
  // setup the websocket connection
  const requestSuccess = await WS_API.setupWebSocketConnection(gameCode.value);

  if (!requestSuccess) {
    alert("An error occured while trying to upgrade the connection with the server.");
    return;
  }

  const request2Success = await WS_API.sendStartGameRequest();

  if (!request2Success) {
    alert("An error occured while trying to start the game.");
    return;
  }

  emit('gameStarted');
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
          <button id="gamecode" @click="copyCode()">{{ gameCode }}</button>
          <p>Go to {{ /*import.meta.env.DOMAIN*/ 'https://sawthat.jazzmoon.host/' }} and enter this code to join!</p>
        </div>
        <button @click="nextSetupStep()">{{ buttonText }}</button>
      </div>
      <div id="right" v-if="gameCode">
        <h2>Who's already here:</h2>
        <PlayersListVue id="players" :players="players" :currentPlayer="null" />
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
#gamecode {
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
</style>
