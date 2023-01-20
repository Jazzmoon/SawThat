<template>
    <div id="background">
        <div id="root">
            <h2>Consequence</h2>
            <p>{{ props.message }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    message: string
}>();
</script>

<style scoped>
#background {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #00000024;
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