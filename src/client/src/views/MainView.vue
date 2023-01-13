<template>
    <main>
        <div id="root">
            <div>
                <img id="logo" :src="LogoSVG"/>
                <h2 id="title">Leaderboard</h2>
            </div>
            <div id="players">
                <div v-for="(player, index) in players" :key="player.name" :class="['player', (currentPlayer == index) ? 'chosen' : '']">
                    <div class="colorIndicator" :style="`border-color: ${player.color}`"></div>
                    <p class="playerName">{{player.name}}</p>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
    import LogoSVG from "@/assets/logo.svg";

    let currentPlayer = 0;
    let players = [
        {
            name: "Player 1",
            color: "#003FA3"
        },
        {
            name: "Player 2",
            color: "#00A324"
        },
        {
            name: "Player 3",
            color: "#A30000"
        },
        {
            name: "Player 4",
            color: "#A39C00"
        },
        {
            name: "Player 5",
            color: "#A39C00"
        },        {
            name: "Player 3",
            color: "#A30000"
        },
        {
            name: "Player 4",
            color: "#A39C00"
        },
        {
            name: "Player 5",
            color: "#A39C00"
        },        {
            name: "Player 3",
            color: "#A30000"
        },
        {
            name: "Player 4",
            color: "#A39C00"
        },
        {
            name: "Player 5",
            color: "#A39C00"
        },        {
            name: "Player 3",
            color: "#A30000"
        },
        {
            name: "Player 4",
            color: "#A39C00"
        },
        {
            name: "Player 5",
            color: "#A39C00"
        },
        {
            name: "Player 6",
            color: "#CE5D5D"
        }
    ];
</script>

<style scoped>
#title {
    font-family: 'Fredericka the Great';
    font-weight: 100;
    text-align: center;
}
#root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 150px 1fr;
}
#logo {
    height: 75px;
    width: auto;
}
#players {
    width: 100%;
    height: 100%;
}

.player {
    height: 50px;
    margin: 0 6px;
    display: flex;
    flex-direction: row;
    padding: 6px;
}

.player.chosen {
    border-radius: 15px;
    border: 5px solid #003fa3;
}

.colorIndicator {
    border: 10px solid #fff;
    border-radius: 50%;
    background-color: transparent;
    height: 15px;
    width: 15px;
    margin-top: 7px;
}

.playerName {
    color: white;
    line-height: 50px;
    vertical-align: middle;
    margin: 0;
    margin-left: 12px;
}
</style>