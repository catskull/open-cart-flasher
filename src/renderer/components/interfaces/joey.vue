<template>
  <div id="joey">
    <h3 class="title is-4">Joey-Joebags is </h3>
    <h3 class="title is-4" v-if="device">connected!</h3>
    <h3 class="title is-4" v-else>not connected!</h3>
    <h3 class="title is-4">{{fwVersion}}</h3>
    <hr>
    <div class="columns">
      <div class="column">
        <div class="field">
          <div class="label">Cart Type</div>
          <div class="control">
            <div class="dropdown" :class="active === true ? 'is-active' : ''">
              <div class="dropdown-trigger">
                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" v-on:click="active = !active">
                  <span v-if="cartType === null">Select a cart</span>
                  <span v-else>{{cartType}}</span>
                  <span class="icon is-small">
                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a
                    class="dropdown-item"
                    v-on:click="cartType = 'Catskull 32K'; active = false"
                    :class="cartType === 'Catskull 32K' ? 'is-active' : ''"
                  >
                    Catskull 32k
                  </a>
                  <a
                    class="dropdown-item"
                    v-on:click="cartType = 'Pirate MBC5'; active = false"
                    :class="cartType === 'Pirate MBC5' ? 'is-active' : ''"
                  >
                    Pirate MBC5
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label class="label">ROM</label>
          <div class="control">
            <a
              class="button"
              v-on:click="selectFile()"
              >
              <span>Select ROM</span>
              <!-- <span class="icon">
                <i class="fa fa-file-o"></i>
              </span> -->
            </a>
          </div>
          <p class="help">{{inputHelpText}}</p>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label class="label">&nbsp</label>
          <div class="control">
            <a
              class="button is-info"
              v-on:click="programCart()"
              :disabled="cartType === null || file === null"
              >
              <span>Flash</span>
              <span class="icon">
                <i class="fa fa-bolt"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import joey from '../../hardware/joey'

  export default {
    data () {
      return {
        active: false,
        cartType: null,
        input: null,
        inputHelpText: '',
        file: null,
        device: null,
        fwVersion: null
      }
    },

    methods: {
      selectFile () {
        this.input = document.createElement('input')
        this.input.accept = '.gb, .gbc, .bin'
        this.input.type = 'file'
        this.input.id = 'rom'
        this.input.name = 'rom'
        this.input.addEventListener('change', this.validateFile)
        this.input.click()
      },

      validateFile () {
        this.file = this.input.files[0]
        if (!['gb', 'gbc', 'bin'].includes(this.file.name.split('.')[1])) {
          this.inputHelpText = 'File must end in .gb, .gbc, or .bin'
          this.file = null
        } else {
          this.inputHelpText = this.file.name
        }
      },

      programCart () {
        if (this.cartType !== null && this.file !== null) {
          console.log('programming ' + this.cartType + ' with ' + this.file.path)
        }
      }
    },

    created () {
      this.device = joey.getDevice()
      if (this.device) {
        joey.getFirmwareVersion(this.device)
        .then(
          response => {
            console.log(response)
            this.fwVersion = response
            console.log(joey.readCartHeader(this.device))
          }
        )
      }
    }
  }
</script>

<style scoped>
#joey {
  padding-top: 10px;
}
</style>
