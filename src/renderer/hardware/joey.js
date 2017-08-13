const commandGetVersion = [0x00]
// const commandGetROM = [0x10]
// const commandSetBank = [0x08]
// const commandFlashROM = [0x20]
//
// let ROMsize = 0
// let ROMbuffer = 0

const usb = require('usb')

export default {
  getDevice () {
    const device = usb.findByIds(0x046d, 0x1234)
    return device
  },

  getFirmwareVersion (device) {
    device.open()
    device.interfaces[0].claim()
    device.interfaces[0].endpoints[1].transfer(commandGetVersion)
    return new Promise(resolve => {
      let text = ''
      device.interfaces[0].endpoints[0].transfer(64, (error, data) => {
        if (error) { console.log(error) }
        data.slice(0, 5).forEach((e) => {
          text += String.fromCharCode(e)
        })
        resolve(text)
      })
    })
  },

  readCartHeader (device) {
    setBank(device, 0, 0)
    ROMBankSwitch(device, 1)

    writeDevice(device, [0x10, 0x00, 0x00, 0x01, 0x00])

    let v1 = readDevice(device)

    writeDevice(device, [0x10, 0x00, 0x00, 0x01, 0x40])

    let v2 = readDevice(device)

    writeDevice(device, [0x10, 0x00, 0x00, 0x01, 0x80])

    let v3 = readDevice(device)

    return Promise.all([v1, v2, v3])
  }
}

function readDevice (device) {
  return new Promise((resolve, reject) => {
    device.interfaces[0].endpoints[0].transfer(64, (error, data) => {
      if (error) {
        reject(error)
      }

      resolve(data)
    })
  })
}

function writeDevice (device, data) {
  return device.interfaces[0].endpoints[1].transfer(data)
}

function setBank (device, blk, sublk) {
  sublk = sublk * 64

  writeDevice(device, [0x0A, 0x00, 0x03, 0x70, 0x00, sublk, 0x70, 0x01, 0xE0, 0x70, 0x02, blk])

  readDevice(device)
  .then(
    data => {
      console.log(data)
    },

    error => {
      console.log(error)
    }
  )
}

function ROMBankSwitch (device, bankNumber) {
  // Convert 16bit bank number to 2 x 8bit numbers
  // Write to address defined under MBC settings to swap banks. This will change depending on certain cart types...
  let bhi = bankNumber >> 8
  let blo = bankNumber & 0xFF
  if (bhi > 0) {
    writeDevice(device, [0x0A, 0x00, 0x01, 0x30, 0x00, bhi])

    readDevice(device)
    .then(
      data => {
        console.log(data)
      },

      error => {
        console.log(error)
      }
    )
  }

  writeDevice(device, [0x0A, 0x00, 0x01, 0x21, 0x00, blo])

  readDevice(device)
  .then(
    data => {
      console.log(data)
    },

    error => {
      console.log(error)
    }
  )
}
