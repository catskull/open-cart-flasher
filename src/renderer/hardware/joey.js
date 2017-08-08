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
    // const RAMtypes = [0, 2048, 8192, 32768, (32768 * 4), (32768 * 2)]
    // global ROMsize
    // global RAMsize
    let header = ''
    device.interfaces[0].endpoints[1].transfer([0x10, 0x00, 0x00, 0x01, 0x00])
    // dev.write(0x01,[0x10,0x00,0x00,0x01,0x00])
    // dat = dev.read(0x81,64)
    device.interfaces[0].endpoints[0].transfer(64, (error, data) => {
      if (error) { console.log(error) }
      header += data
    })
    // Header=dat
    // const msg = [0x10, 0x00, 0x00, 0x01, 0x40]
    device.interfaces[0].endpoints[1].transfer([0x10, 0x00, 0x00, 0x01, 0x40])
    // dev.write(0x01,msg)
    // dat = dev.read(0x81,64)
    // Header+=dat
    device.interfaces[0].endpoints[0].transfer(64, (error, data) => {
      if (error) { console.log(error) }
      header += data
    })
    // msg = [0x10, 0x00, 0x00, 0x01, 0x80]
    // dev.write(0x01,msg)
    device.interfaces[0].endpoints[1].transfer([0x10, 0x00, 0x00, 0x01, 0x80])
    // dat = dev.read(0x81,64)
    device.interfaces[0].endpoints[0].transfer(64, (error, data) => {
      if (error) { console.log(error) }
      header += data
      console.log(header.slice(0x32, 0x43))
    })
    // Header+=dat #Header contains 0xC0 bytes of header data
    // const romSize = (32768 * (Math.pow(2, header[0x48])))
    // const romName = header[0x34:0x43]
    // romName = re.sub(r'\W+', '', romName)
    // app.ROMtitleLabel.set("ROM Name: " + romName )
    // app.ROMsizeLabel.set("ROM Size: "+str (32768*( 2**(Header[0x48]))))
    // const ramSize = RAMtypes[header[0x49]]
    // app.RAMsizeLabel.set("RAM Size:"+str(RAMsize))
    // root.update()
    return header
  }
}

function setBank (device, blk, sublk) {
  // Lock cart before writing
  sublk = sublk * 64
  // print (hex(blk),hex(sublk))
  device.interfaces[0].endpoints[1].transfer([0x0A, 0x00, 0x03, 0x70, 0x00, sublk, 0x70, 0x01, 0xE0, 0x70, 0x02, blk])
  // USBbuffer = dev.read(0x81,64)
  device.interfaces[0].endpoints[0].transfer(64, (error, data) => {
    if (error) { console.log(error) }
  })
}

function ROMBankSwitch (device, bankNumber) {
  // Convert 16bit bank number to 2 x 8bit numbers
  // Write to address defined under MBC settings to swap banks. This will change depending on certain cart types...
  let bhi = bankNumber >> 8
  let blo = bankNumber & 0xFF
  if (bhi > 0) {
    device.interfaces[0].endpoints[1].transfer([0x0A, 0x00, 0x01, 0x30, 0x00, bhi])
    // dev.write(0x01,[0x0A,0x00,0x01,0x30,0x00,bhi])
    // USBbuffer = dev.read(0x81,64)
    device.interfaces[0].endpoints[0].transfer(64, (error, data) => {
      if (error) { console.log(error) }
    })
  }
  device.interfaces[0].endpoints[1].transfer([0x0A, 0x00, 0x01, 0x21, 0x00, blo])
  // dev.write(0x01,[0x0A,0x00,0x01,0x21,0x00,blo])
  // USBbuffer = dev.read(0x81,64)
  device.interfaces[0].endpoints[0].transfer(64, (error, data) => {
    if (error) { console.log(error) }
  })
}
