<template>
  <HomeView v-if="!gameStarted" />
  <QuestionView v-else-if="questionShown" />
  <MainView v-else/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HomeView from './views/HomeView.vue';
import MainView from './views/MainView.vue';
import QuestionView from './views/QuestionView.vue';

let gameStarted = ref(false);
let questionShown = ref(false);

// TODO IF GAME ENDS OR CONNECTION IS LOST, SET JOINED TO FALSE AND ANSWERING TO FALSE
// SET THIS CLASS AS THE CALLBACK FOR MESSAGES AND THEN FORWARD TO THE VIEWS AS NEEDED
// BUT THI SAPPROACH WILL ALLOW ME TO INTERCEPT CONNECTION CHANGES AND GAME ENDS
</script>

<style scoped>

</style>
