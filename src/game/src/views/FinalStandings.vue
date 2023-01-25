<template>
    <div id="page">
        <div>
            <h1 id="title">Final Standings</h1>
            <button @click="exit()">Return to Homescreen</button>
        </div>
        <div id="tripleColumn">
            <div id="first">
                <div class="colorIndicator" :style="`border-color: ${props.top3Players[0].color}`"></div>
                <p class="playerName">{{props.top3Players[0].username}}</p>
                <span class="standing">
                    <h1>1</h1><h3>st</h3>
                </span>
            </div>
            <div id="second">
                <div class="colorIndicator" :style="`border-color: ${props.top3Players[1].color}`"></div>
                <p class="playerName">{{props.top3Players[1].username}}</p>
                <span class="standing">
                    <h1>2</h1><h3>nd</h3>
                </span>
            </div>
            <div id="third" v-if="props.top3Players.length > 2">
                <div class="colorIndicator" :style="`border-color: ${props.top3Players[2].color}`"></div>
                <p class="playerName">{{props.top3Players[2].username}}</p>
                <span class="standing">
                    <h1>3</h1><h3>rd</h3>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Player } from '../../../shared/types/Player';

const props = defineProps<{
    top3Players: Player[]
}>();

const emit = defineEmits(['close']);

function exit() {
    emit('close');
}
</script>

<style scoped>
#page {
    height: 100%;
    display: flex;
    flex-direction: column;
}

#title {
    margin-top: 64px;
}

#tripleColumn {
    display: grid;
    grid-template-columns: 1.45fr 0.85fr 0.7fr;
    height: 100%;
    width: 100%;
    align-items: end;
}

#first,
#second,
#third {
    padding: 24px;
    border-radius: 25px 25px 0 0;
    margin: 0 4px;
}

#first {
    border: gold solid 15px;
    background-color: rgba(255, 217, 0, 0.3);
    height: 75%;
}

#second {
    border: silver solid 15px;
    background-color: rgba(192, 192, 192, 0.3);
    height: 50%;
}

#third {
    border: brown solid 15px;
    background-color: rgba(165, 42, 42, 0.3);
    height: 35%;
}

.colorIndicator{
    margin: auto;
}

h1, h3 {
    padding: 0;
    margin: 0;
}

h1 {
    font-weight: 100;
    font-size: 50px;
}

h3 {
    font-size: 25px;
}

button {
    border: 1rem solid #003fa3;
    border-radius: 30px;
    margin: 8px;
    color: white;
    text-align: center;
    background-color: #003fa3;
    min-width: 120px;
}

.standing {
    display: flex;
    flex-direction: row;
}
</style>
