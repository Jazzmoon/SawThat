<template>
  <HomeView v-if="!joined" @joined="joined = true" />
  <MultiChoiceQuestion v-else-if="answering" />
  <MainView v-else />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WS_API } from './middleware/WS_API';
import HomeView from './views/HomeView.vue';
import MainView from './views/MainView.vue';
import MultiChoiceQuestion from './views/MultiChoiceQuestion.vue';

let joined = ref(false);
let answering = ref(false);

// TODO UPDATE THIS TYPES TO BE CONSISTENT WITH SERVER
WS_API.addIncomingMessageCallback("App", (data: any) => {
  switch (data.type) {
    case "error":
      alert(data.message); // TODO EXIT IF CONNECTION LOST (THIS IS A HARDCODED MESSAGE FROM WS_API)
      break;
    case "question":
      answering.value = true;
      break;
    case "answered":
      answering.value = false;
      break;
  }
});

</script>

<style scoped>

</style>
