<script setup lang="ts">
let questionText = "A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines";
let questionAnswer = "";
function submit(){
  alert("entered text: " + questionAnswer);
}
</script>

<template>
  <main id="backgroundImage">
    <p id="questiontext">{{questionText}}</p>
    <input type="text" v-model="questionAnswer" placeholder="Your Answer Here"/>
    <button @click="submit()">Submit!</button>
  </main>
</template>

<style scoped>
#questiontext {
  margin-bottom: 24px;
}
#choices {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5%;
}

input, button {
  border: 1rem solid #003FA3;
  border-radius: 30px;
  padding: 12px;
  margin: 8px;
  color: white;
  text-align: center;
  font-size: 1.5rem;
  width: 100%;
}
input {
  background-color: transparent;
}

button {
  background-color: #003FA3;
}
</style>
