<template>
    <div id="background">
        <div id="root">
            <h2>Consequence</h2>
            <p>{{ props.data.story }}</p>
            <p>{{ timer }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { ConsequenceData } from '../../../shared/apis/WebSocketAPIType';

const timer = ref(0);

const props = defineProps<{
    data: ConsequenceData
}>();

onMounted(() => {
    console.log(props.data)
    if (props.data.timer_end) {
        timer.value = props.data.timer_length - (Date.now() - new Date(props.data.timer_end).getTime()) / 1000;
    } else {
        timer.value = props.data.timer_length;
    }
    tick();
});

function tick() {
    setTimeout(() => {
        timer.value--;
        if (timer.value > 0) {
            tick();
        }
    }, 1000);
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
    height: 550px; /* TODO MAKE THIS DYNAMIC */
}

#root * {
    text-align: center;
}
</style>