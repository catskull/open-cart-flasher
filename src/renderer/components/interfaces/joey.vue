<template>
  <div id="joey">
    <h4 class="title is-4">Joey-Joebags is </h4>
    <h4 class="title is-4" v-if="device">connected!</h4>
    <h4 class="title is-4" v-else>not connected!</h4>
    <h6 v-if="fwVersion" class="title is-6">{{fwVersion}}</h6>
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
        fwVersion: null,
        header: '',
        romName: null,
        ramSize: 0,
        romSize: 0
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
      },

      getCharAsDecimalUTF8 (char) {
        const getUTF8 = escape(char)
        return parseInt(getUTF8.substring(getUTF8.match(/u/) !== null ? 2 : 1), 16)
      }
    },

    created () {
      this.device = joey.getDevice()
      if (this.device) {
        joey.getFirmwareVersion(this.device)
        .then(
          response => {
            this.fwVersion = response
            joey.readCartHeader(this.device)
            .then(
              data => {
                data.forEach(e => {
                  this.header += e
                })
                this.romName = this.header.slice(0x32, 0x41)
                const RAMtypes = ['no SRAM', '2 kilobytes', '8 kilobytes', '32 kilobytes', '128 kilobytes', '64 kilobytes']
                const ROMtypes = ['32 kilobytes', '64 kilobytes', '128 kilobytes', '256 kilobytes', '512 kilobytes', '1 megabyte', '2 megabytes', '4 megabytes', '8 megabytes', '1.1 megabytes', '1.2 megabytes', '1.5 megabytes']
                const ramIndex = this.getCharAsDecimalUTF8(this.header[0x47])
                const romIndex = this.getCharAsDecimalUTF8(this.header[0x46])
                this.ramSize = RAMtypes[ramIndex]
                this.romSize = ROMtypes[romIndex]
              },

              error => {
                console.log(error)
              }
            )
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

h4, h6 {
  display: inline;
}

h6 {
  float: right;
  margin-right: 1rem;
}
</style>
