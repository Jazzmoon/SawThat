<script setup lang="ts">
import type { QuestionData } from "../../../shared/apis/WebSocketAPIType";
import type { Player } from "../../../shared/types/Player";
const props = defineProps<{
  data: QuestionData;
  players: Player[];
}>();
</script>

<template>
  <main id="parent">
    <div id="gradient">
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
      :src="props.data.media_url ?? ''"
    />
  </main>
</template>

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
    rgba(0, 0, 0, 0) 0.79%,
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
