<template>
  <main id="parent">
    <div id="gradient">
      <RadialProgress
        style="margin: auto"
        :diameter="70"
        :completed-steps="timer"
        :total-steps="props.data.timer_length"
        start-color="blue"
        stop-color="blue"
      >
        {{ timer }}
      </RadialProgress>
      <p class="questionInfo" v-if="props.data.all_play">
        All Play; anyone may answer!
        {{ props.players[0].username }} will move
        {{ props.data.movement_die }} spaces if they answer correctly!
      </p>
      <p class="questionInfo" v-else>
        My Play; only {{ props.players[0].username }} may answer, moving
        {{ props.data.movement_die }} spaces if correct!
      </p>
      <p id="questionText">{{ props.data.question }}</p>
    </div>
    <img
      id="background"
      v-if="props.data.media_type === 'image'"
      :src="backgroundImage"
      @error="imageError = true"
    />
  </main>
</template>

<script setup lang="ts">
import RadialProgress from "vue3-radial-progress";
import type { QuestionData } from "../../../shared/apis/WebSocketAPIType";
import type { Player } from "../../../shared/types/Player";
import {ref, computed, onMounted } from "vue";

const props = defineProps<{
  data: QuestionData;
  players: Player[];
}>();

let imageError = ref(false);

let backgroundImage = computed(() => {
  return (!imageError.value && props.data.media_url)
    ? props.data.media_url! 
    : '/backup_background_img.jpg';
});

const timer = ref(0);

onMounted(() => {
  let offset = props.data.timer_start
    ? ((Date.now() - new Date(props.data.timer_start).getTime()) / 1000)
    : 0;
  timer.value = props.data.timer_length - Math.ceil(offset);
  tick(offset);
});

/**
 * Counts down seconds until timer.value = 0.
 * @param offset Accounts for transmission delay from server to node (first tick can be made shorter)
 */
function tick(offset: number = 0): void {
  setTimeout(() => {
    timer.value--;
    if (timer.value > 0) {
      tick(200); // adjust for various overhead (overcompensating is ok)
    }
  }, 1000 - offset);
}
</script>

<style scoped>
#parent {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#questionText {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  text-align: start;
  font-size: 64px;
}
.questionInfo {
  vertical-align: bottom;
  position: absolute;
  bottom: 5px;
  left: 24px;
  right: 24px;
  text-align: start;
  font-size: 24px;
}
#gradient {
  background: linear-gradient(
    180.92deg,
    rgba(0, 0, 0, 0) 3%,
    rgba(23, 23, 23, 0.65) 25%,
    #171717 58.42%
  );
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75%;
}
#background {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
