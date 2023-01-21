<script setup lang="ts">
const props = defineProps<{
  question: string,
  backgroundImageUrl: string
}>();
</script>

<template>
  <main id="parent">
    <div id="gradient">
      <p id="questiontext">{{props.question}}</p>
    </div>
    <img id="background" :src="props.backgroundImageUrl"/>
  </main>
</template>

<style scoped>
#parent {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#questiontext {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  text-align: start;
  font-size: 65px;
}
#gradient {
  background: linear-gradient(180.92deg, rgba(0, 0, 0, 0) 0.79%, rgba(23, 23, 23, 0.65) 25%, #171717 58.42%);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75%;
}
#background {
  height: 100%;
  width: 100%;
}
</style>
