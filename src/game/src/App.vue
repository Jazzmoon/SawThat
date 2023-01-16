<template>
  <HomeView v-if="!gameStarted" />
  <QuestionView v-else-if="questionShown" />
  <MainView v-else/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WS_API } from './middleware/WS_API';
import HomeView from './views/HomeView.vue';
import MainView from './views/MainView.vue';
import QuestionView from './views/QuestionView.vue';

let gameStarted = ref(false);
let questionShown = ref(false);

// TODO UPDATE THIS TYPES TO BE CONSISTENT WITH SERVER
WS_API.addIncomingMessageCallback("App", (data: any) => {
  switch (data.type) {
    case "error":
      alert(data.message); // TODO EXIT IF CONNECTION LOST (THIS IS A HARDCODED MESSAGE FROM WS_API)
      break;
    case "question":
      questionShown.value = true;
      break;
    case "answered":
      questionShown.value = false;
      break;
  }
});
</script>

<style scoped>

</style>
