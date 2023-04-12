<template>
  <main>
    <div id="root">
      <div id="left">
        <LogoSVG id="icon" />
        <h1 id="title">SawThat?</h1>
        <div v-if="isGameCreated()">
          <p>Game Code (Click to Copy):</p>
          <button id="gameCode" @click="copyCode()">{{ gameCode }}</button>
          <p>
            Go to
            {{ /*import.meta.env.DOMAIN*/ "https://sawthat.jazzmoon.ca/" }}
            and enter this code to join!
          </p>
        </div>
        <div v-else>
          <h3>Theme Pack</h3>
          <select v-model="selectedTheme">
            <option v-for="theme in themesDisplay" :value="theme">
              {{ theme }}
            </option>
          </select>
        </div>
        <br />
        <button id="gameButton" @click="nextSetupStep()" :disabled="!canGoNext">
          {{ buttonText }}
        </button>
        <br />
      </div>
      <div id="right">
        <div v-if="gameCode">
          <h2>Who's already here:</h2>
          <PlayersListVue
            id="players"
            :players="props.players"
            :shownIndex="false"
          />
        </div>
        <div id="instructions" v-else>
          <h2>Instructions</h2>
          <h3>Game Host</h3>
          <ul>
            <li>Select a theme pack from the dropdown menu from the left</li>
            <li>
              Click "Create A New Game" and send the displayed game code to your
              players
            </li>
            <li>
              Wait for players to join, then press "Start Game" when ready
            </li>
          </ul>
          <h3>Player</h3>
          <ul>
            <li>
              Enter the game code given by your host, choose a username, then
              press "Go!"
            </li>
            <li>Answer questions first on your turn to move forward</li>
            <li>
              Answer questions first on other players' turns to stop them from
              moving forward
            </li>
            <li>
              Reach the end of the board to win, but watch out for consequence
              cards
            </li>
          </ul>
          <h2>Mechanics</h2>
          <ul>
            <li>
              On each turn, either a Question or Consequence Card will be played
            </li>
            <li>
              Each card has an associated random movement value, which is always
              positive for Questions, but can be negative for Consequences
            </li>
            <li>
              Each Question is either a "My Play", where only one person may
              answer, or an "All Play", where anyone may answer. Regardless of
              which, only the player whose turn it is may advance on a correct
              answer
            </li>
            <li>
              Each Consequence only affects the current player, and will cause
              them to either move forwards or backwards
            </li>
          </ul>
          <h2>Link for players to join:</h2>
          <img src="/client_node_qrcode.png"/>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import LogoSVG from "@/assets/logo.svg?component";
import PlayersListVue from "@/components/PlayersList.vue";
import { HTTP_API } from "@/middleware/HTTP_API";
import { WS_API } from "@/middleware/WS_API";
import { computed, ref, onMounted } from "vue";
import { WebsocketType } from "../../../shared/enums/WebsocketTypes";
import type { Player } from "../../../shared/types/Player";

const props = defineProps<{
  players: Player[];
}>();

const emit = defineEmits(["gameStarted"]);

const gameCode = ref("");
const canGoNext = ref(true);

let themes: string[] = [];
let themesDisplay = ref([] as string[]);
let selectedTheme = "";

onMounted(async () => {
  themes = await HTTP_API.getAvailableThemePacks();
  themesDisplay.value = themes.map((name) =>
    name
      .split("_")
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join(" ")
  );
  selectedTheme = themesDisplay.value[0];
});
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
  if (selectedTheme.length === 0) {
    alert("Please select a theme first");
    return;
  }
  const index = themesDisplay.value.indexOf(selectedTheme);
  const requestResult = await HTTP_API.sendCreate(themes[index]);
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

  // Disable start button since there are no players at first and
  // update the start button whenever a player joins or disconnects.
  canGoNext.value = false;
  let playerCounter = 0;
  WS_API.addIncomingMessageCallback("checkPlayerCount", (message) => {
    switch (message.type) {
      case WebsocketType.GameJoinAck:
        playerCounter++;
        break;
      case WebsocketType.PlayerDisconnectAck:
        playerCounter--;
        break;
    }
    canGoNext.value = playerCounter >= 2;
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
  border-radius: 25px;
}
#left {
  margin-left: 48px;
}
#right {
  display: inline-block;
  margin-left: 48px;
  width: 100%;
}

#instructions {
  width: 75%;
  max-width: 700px;
  min-width: 200px;
  height: 97vh;
  margin: 24px auto;
  overflow-y: auto;
}

#instructions ul {
  text-align: left;
}

#instructions li {
  padding: 4px;
}

button {
  border: 1rem solid #003fa3;
  border-radius: 25px;
  margin: 8px;
  color: white;
  text-align: center;
  background-color: #003fa3;
  min-width: 160px;
}

button:disabled {
  border: 1rem solid #778db1;
  background-color: #778db1;
}

select {
  width: 95%;
  padding: 8px;
  background-color: #003fa3;
  border-radius: 25px;
  color: white;
  border: none;
}
</style>
