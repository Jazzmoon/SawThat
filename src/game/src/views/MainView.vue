<script lang="ts" setup>
import BoardVue from '@/components/Board.vue';
</script>

<template>
    <main>
       <BoardVue id="gameBoard"/>
    </main>
</template>

<style scoped>
#gameBoard {
    width: 100%;
}
</style>