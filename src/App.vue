<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App'
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#app {
  flex: 1;
  display: flex;
  padding: 5px;
  flex-direction: column;
}
</style>
