<template>
  <div id="menu">
    <h3 class="title">Interface</h3>
    <a class="button" :class="joeyClass" v-on:click="chooseFocus('joey')">Joey-Joebags</a>
    <a class="button" :class="reinerClass" v-on:click="chooseFocus('reiner')">Reiner Zeigler</a>
    <a class="button" :class="altaneClass" v-on:click="chooseFocus('altane')">Altane</a>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        joeyClass: 'is-focused',
        reinerClass: '',
        altaneClass: ''
      }
    },

    methods: {
      chooseFocus (item) {
        if (item === 'joey') {
          this.joeyClass = 'is-focused'
          this.reinerClass = ''
          this.altaneClass = ''
        } else if (item === 'reiner') {
          this.reinerClass = 'is-focused'
          this.joeyClass = ''
          this.altaneClass = ''
        } else if (item === 'altane') {
          this.altaneClass = 'is-focused'
          this.joeyClass = ''
          this.reinerClass = ''
        }
      }
    }
  }
</script>

<style scoped>
  #menu {
    padding-top: 10px;
    margin-left: 10px;
    padding-right: 10px;
    border-right: gray;
    border-right-style: solid;
    height: 100%;
  }

  a {
    width: 100%;
  }
</style>
