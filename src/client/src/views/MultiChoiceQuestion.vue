<template>
  <main id="backgroundImage">
    <p id="questiontext">{{props.question}}</p>
    <div id="choices">
      <button class="btnBlue" @click="submit(1)">A</button>
      <button class="btnRed" @click="submit(2)">B</button>
      <button class="btnYellow" @click="submit(3)">C</button>
      <button class="btnGreen" @click="submit(4)">D</button>
    </div>
  </main>
</template>

<script setup lang="ts">
const props = defineProps<{
  question: string
}>();

function submit(choice: number){
  alert("clicked button: " + choice);
  // TODO SEND BACK TO THE SERVER (APP WILL HANDLE RETURNING TO THE LEADERBOARD SCREEN)
}
</script>

<style scoped>
#questiontext {
  margin-bottom: 24px;
}
#choices {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5%;
}

button {
  padding: 12px;
  border-radius: 15px;
  color: white;
  font-weight: 600;
  font-size: 3rem;
  aspect-ratio: 1;
}

.btnBlue {
  background: rgba(6, 86, 211, 0.5);
  border: 8px solid #0356DA;
}
.btnRed {
  background: rgba(218, 3, 3, 0.5);
  border: 8px solid #DA0303;
}
.btnYellow {
  background: rgba(218, 209, 3, 0.5);
  border: 8px solid #DAD103;
}
.btnGreen {
  background: rgba(46, 218, 3, 0.5);
  border: 8px solid #2EDA03;
}
</style>
