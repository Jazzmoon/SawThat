<script setup lang="ts">
import type { QuestionData } from "../../../shared/apis/WebSocketAPIType";
const props = defineProps<{
  data: QuestionData;
}>();
</script>

<template>
  <main id="parent">
    <div id="gradient">
      <p id="questionInfo">
        {{
          props.data.all_play
            ? "All Play! Anyone"
            : `My Play! Only (TODO: Player Name)`
        }}
        may answer to move {{ props.data.movement_die }} spaces!
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
  font-size: 65px;
}
#questionInfo {
  text-align: center;
  font-size: 65px;
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
