<template>
    <div class="home-container">
      <div class="aquire-token">
        <OAuthGetBox />
      </div>
      <div class="character-static">
        <CharacterStatic />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import CharacterStatic from '../views/CharacterStatic.vue';
  import AquireToken from '../views/AquireToken.vue';
  import OAuthGetBox from '../views/OAuthGetBox.vue';
  
  </script>
  
  <style scoped>
  .home-container {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background-color: aliceblue;
  justify-content: space-between;
}
  .character-static {
    flex-grow: 1;
  }
  </style>