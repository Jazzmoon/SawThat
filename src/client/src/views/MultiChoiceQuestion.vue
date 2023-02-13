<template>
  <main id="backgroundImage">
    <p id="questionText">{{props.data.question}}</p>
    <div id="choices">
      <button class="btnBlue" @click="submit(0)">{{ props.data.options[0] }}</button>
      <button class="btnRed" @click="submit(1)">{{ props.data.options[1] }}</button>
      <button class="btnYellow" @click="submit(2)">{{ props.data.options[2] }}</button>
      <button class="btnGreen" @click="submit(3)">{{ props.data.options[3] }}</button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { WS_API } from '@/middleware/WS_API';
import type { QuestionData } from '../../../shared/apis/WebSocketAPIType';
import { WebsocketType } from '../../../shared/enums/WebsocketTypes';

const props = defineProps<{
  data: QuestionData
}>();

const emit = defineEmits(['answered']);

async function submit(choice: number){
  emit('answered');

  const response = await WS_API.sendMultipleChoiceAnswer(props.data.options[choice], props.data);

  if (!response || response.type === WebsocketType.Error) {
    alert(`Failed to send response to the server the game.\n${JSON.stringify(response)}`);
  }
}
</script>

<style scoped>
#questionText {
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
