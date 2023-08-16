const __FRAMERATE = 50






const fs = require('fs')
const path = require('path')
const pathdata = (fs.readFileSync(path.resolve('apps/demopath.txt'))+``).split('\n') //svg path converted to points array
const Speaker = require('speaker')
const speaker = new Speaker({
    channels:2,
    bitDepth:16,
    sampleRate:44100
})

let i = 0
var pipe = null
function start() {}
function end() {
    pipe.destroy()
}
function update() {}

function fixedupdate() {
    let asd = pathdata[i]?.split('|')
    if(asd.length == 0) return
    asd.pop()
    for(let vect of asd) {
        (new this.Vector(
            Math.floor(Number(vect.split('@')[0].split(',')[0])/4),
            Math.floor(128-Number(vect.split('@')[0].split(',')[1])/4),
            Math.floor(Number(vect.split('@')[1].split(',')[0])/4),
            Math.floor(128-Number(vect.split('@')[1].split(',')[1])/4)
        )).draw()
    }
    if(!pipe) pipe = fs.createReadStream(path.resolve('apps/badapple.wav')).pipe(speaker) //
    if(i++>pathdata.length) {
        i--
        return process.exit(0)
    }
}

module.exports = {start,update,fixedupdate,end,__FRAMERATE}