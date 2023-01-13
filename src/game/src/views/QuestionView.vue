<script setup lang="ts">
let questionText = "A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines.A very long question goes here that can span a couple lines";
</script>

<template>
  <main id="backgroundImage">
    <p id="questiontext">{{questionText}}</p>
  </main>
</template>

<style scoped>
#questiontext {
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
