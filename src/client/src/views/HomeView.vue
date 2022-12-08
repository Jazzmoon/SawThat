<script setup lang="ts">
import LogoSVG from "@/assets/logo.svg";

let gameCode = "";
let playerName = "";

function submit() {
  alert("Submit clicked");
}
</script>

<template>
  <main>
    <div id="root">
      <img id="icon" :src="LogoSVG" />
      <h1 id="title">SawThat?</h1>
      <div id="inputs">
        <p id="hint">Enter your game code to start:</p>
        <input type="text" v-model="gameCode" placeholder="Game Code"/>
        <input type="text" v-model="playerName" placeholder="Your Name"/>
        <button @click="submit()">Go!</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
#root {
  display: flex;
  flex-direction: column;
}
#title {
  font-family: 'Fredericka the Great';
  text-align: center;
  font-weight: 100;
  font-size: 5rem;
  margin-bottom: 50px;
}
#inputs {
  display: flex;
  flex-direction: column;
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
#hint {
  text-align: center;
}
input, button {
  border: 1rem solid #003FA3;
  border-radius: 30px;
  padding: 12px;
  margin: 8px;
  color: white;
  text-align: center;
  font-size: 1.5rem;
}
input {
  background-color: transparent;
}

button {
  background-color: #003FA3;
}
</style>
