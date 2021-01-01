<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="sass">
*
  box-sizing: border-box
body
  font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif
h4
  font-weight: 500
  font-size: 1.25rem
  line-height: 1
  margin: 0
</style>
