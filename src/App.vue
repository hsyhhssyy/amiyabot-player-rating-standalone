<template>
  <div id="app-view">
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

#app-view {
  flex: 1;
  display: flex;
  padding: 5px;
  width: 100%;
  flex-direction: column;
}
</style>
