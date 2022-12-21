<script setup lang="ts">
import LogoSVG from "@/assets/logo.svg";
import PlayersListVue from "@/components/PlayersList.vue";

let serverURL = "URL";
let gameCode = "123456";

let players: Player[] = [
  {
    name: "Player 1",
    color: "#003FA3",
  },
  {
    name: "Player 2",
    color: "#00A324",
  },
  {
    name: "Player 3",
    color: "#A30000",
  },
  {
    name: "Player 4",
    color: "#A39C00",
  },
  {
    name: "Player 5",
    color: "#A39C00",
  },
  {
    name: "Player 3",
    color: "#A30000",
  },
  {
    name: "Player 4",
    color: "#A39C00",
  },
  {
    name: "Player 5",
    color: "#A39C00",
  },
  {
    name: "Player 3",
    color: "#A30000",
  },
  {
    name: "Player 4",
    color: "#A39C00",
  },
  {
    name: "Player 5",
    color: "#A39C00",
  },
  {
    name: "Player 3",
    color: "#A30000",
  },
  {
    name: "Player 4",
    color: "#A39C00",
  },
  {
    name: "Player 5",
    color: "#A39C00",
  },
  {
    name: "Player 6",
    color: "#CE5D5D",
  },
];

function copyCode() {
  navigator.clipboard.writeText(gameCode);
  alert("Copied game code to clipboard.")
}
</script>

<template>
  <main>
    <div id="root">
      <div id="left">
        <LogoSVG id="icon" />
        <h1 id="title">SawThat?</h1>
        <p>Game Code (Click to Copy):</p>
        <button id="gamecode" @click="copyCode()">{{ gameCode }}</button>
        <p>Go to {{ serverURL }} and enter this code to join!</p>
        <button @click="startGame()">Start Game</button>
      </div>
      <div id="right">
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
  /* padding: 12px 24px; */
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
