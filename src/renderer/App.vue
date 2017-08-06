<template>
  <div id="app">
    <div class="columns">
      <div class="column is-one-quarter">
        <leftnav></leftnav>
      </div>
      <div class="column is-three-quarters">
        <joey></joey>
      </div>
    </div>
  </div>
</template>

<script>
  import leftnav from '@/components/menu'
  import joey from '@/components/interfaces/joey'

  export default {
    name: 'open-cart-flasher',
    components: {
      leftnav,
      joey
    }
  }
</script>

<style>
  html, body {
    height: 100%;
  }

  #app {
    height: 100%;
  }

  .columns {
    height: 100%;
  }
</style>
