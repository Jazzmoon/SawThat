<template>
  <div id="background">
    <div id="root">
      <h2>Consequence</h2>
      <h3>For {{ props.data.recipient_name || "Unknown Player" }}</h3>
      <p>{{ props.data.story }}</p>
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
      <h3
        v-if="
          props.data.consequence_type == 0 || props.data.consequence_type == 3
        "
      >
        Move {{ props.data.movement_die }} Spaces
      </h3>
      <h3
        v-else-if="
          props.data.consequence_type == 1 || props.data.consequence_type == 2
        "
      >
        Move {{ -props.data.movement_die }} Spaces Back
      </h3>
      <!-- Below are unimplemented; lose counts as negative movement, skip is positive. -->
      <h3 v-else-if="props.data.consequence_type == 2">Lose a Turn</h3>
      <h3 v-else-if="props.data.consequence_type == 3">Skip a Turn</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
import RadialProgress from "vue3-radial-progress";
import { onMounted, ref } from "vue";
import type { ConsequenceData } from "../../../shared/apis/WebSocketAPIType";

const timer = ref(0);

const props = defineProps<{
  data: ConsequenceData;
}>();

onMounted(() => {
  let offset = props.data.timer_start
    ? ~~((Date.now() - new Date(props.data.timer_start).getTime()) / 1000)
    : 0;
  timer.value = props.data.timer_length - offset;
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
      tick(0);
    }
  }, 1000 - offset);
}
</script>

<style scoped>
#background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000066;
  display: flex;
  justify-content: center;
  align-items: center;
}

#root {
  border: white 5px solid;
  background-color: black;
  border-radius: 25px;
  padding: 12px;
  align-content: center;
  width: 400px;
}

#root * {
  text-align: center;
}
</style>
