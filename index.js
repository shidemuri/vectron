const SETTINGS = {
    size: 256, //preferably size%128==0 :3
    beam_radius:1.5
}

console.log('Vectron 1.0')

const sdl = require('@kmamal/sdl')
const Canvas = require('canvas')
const window = sdl.video.createWindow({title:'Vectron',width:SETTINGS.size,height:SETTINGS.size})
window.setIcon(32,32,32*3,'bgr24',require('fs').readFileSync('icon'))
const sharp = require('sharp')
const path = require('path')

let chosen = process.argv[2]
if(!chosen) {
    console.log('No path provided, selecting demo\nUsage: node index.js <PathResolvable>')
    chosen = 'apps/demo.js'
}


//window.setIcon()
const canvas = Canvas.createCanvas(128,128)

const ctx = canvas.getContext('2d')
ctx.strokeStyle='white'
ctx.lineWidth = SETTINGS.beam_radius


class Vector {
    /** 
     * Creates a new Vector object, a line segment that goes from (x1,y1) to (x2,y2)
     * @param {Number} x1 X position of the first point
     * @param {Number} y1 Y position of the first point
     * @param {Number} x2 X position of the second point
     * @param {Number} y2 Y position of the second point
     * @return {Vector}
    */
    constructor(x1,y1,x2,y2) {
        const a = [x1,y1,x2,y2]
        const b = ['x1','y1','x2','y2']
        for(const c in a) console.assert(Number(a[c]) !== NaN,`${b[c]} must be a number. Received ${typeof a[c]}`)
        this.x1=Math.floor(x1)
        this.y1=Math.floor(y1)
        this.x2=Math.floor(x2)
        this.y2=Math.floor(y2)
    }
    /**
     * Renders a white line-segment from (this.x1,this.y1) to (this.x2,this.y2)
     */
    draw = ()=>{
        ctx.beginPath()
        ctx.moveTo(this.x1,canvas.width-this.y1)
        ctx.lineTo(this.x2,canvas.height-this.y2)
        ctx.stroke()
    }
    /**
     * Returns the intersection between v1 and v2 (if any), returns false if none
     * @param {Vector} v1 the first Vector
     * @param {Vector} v2 the second Vector
     * @returns {(false|{x: Number, y: Number})} coordinate object
     */
    static intersect(v1,v2) { // http://paulbourke.net/geometry/pointlineplane/javascript.txt
        if ((v1.x1 === v1.x2 && v1.y1 === v1.y2) || (v2.x1 === v2.x2 && v2.y1 === v2.y2)) return false
        const denominator = ((v2.y2 - v2.y1) * (v1.x2 - v1.x1) - (v2.x2 - v2.x1) * (v1.y2 - v1.y1))
        if (denominator === 0) return false
        let ua = ((v2.x2 - v2.x1) * (v1.y1 - v2.y1) - (v2.y2 - v2.y1) * (v1.x1 - v2.x1)) / denominator
        let ub = ((v1.x2 - v1.x1) * (v1.y1 - v2.y1) - (v1.y2 - v1.y1) * (v1.x1 - v2.x1)) / denominator
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false
        return {x:Math.floor(v1.x1 + ua * (v1.x2 - v1.x1)), y:Math.floor(v1.y1 + ua * (v1.y2 - v1.y1))}
    }
    /**
     * Checks if a point is inside the Vector
     * @param {Vector} s the Vector to check for
     * @param {{x:Number,y:Number}} p the coordinates for the point
     * @returns {Boolean}
     */
    static isBetween(s,p) {
        const cross = (p.y-s.y1)*(s.x2-s.x1)-(p.x-s.x1)*(s.y2-s.y1)
        if(Math.abs(cross)!==0) return false
        const dot = (p.x-s.x1)*(s.x2-s.x1)+(p.y-s.y1)*(s.y2-s.y1)
        if(dot<0) return false
        const sqlenba = ((s.x2-s.x1)**2)+((s.y2-s.y1)**2)
        if(dot > sqlenba) return false
        return true
    }
    /**
     * Checks if the edges of v1 are touching any point in v2
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {boolean}
     */
    static isEdgeTouching(v1,v2){
        return this.isBetween(v2,{x:v1.x1,y:v1.y1}) || this.isBetween(v2,{x:v1.x2,y:v1.y2})
    }
    /**
     * Adds the coordinates of v1 and v2
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Vector}
     */
    static add(v1,v2){
        return new this(v1.x1+v2.x2, v1.y1+v2.y1, v1.x2+v2.x2, v1.y2+v2.y2)
    }
    /**
     * 
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Vector}
     */
    static sub(v1,v2){
        return new this(v1.x1-v2.x2, v1.y1-v2.y1, v1.x2-v2.x2, v1.y2-v2.y2)
    }
    /**
     * 
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Vector}
     */
    static mul(v1,v2){
        return new this(v1.x1*v2.x2, v1.y1*v2.y1, v1.x2*v2.x2, v1.y2*v2.y2)
    }
    /**
     * 
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Vector}
     */
    static div(v1,v2){
        return new this(v1.x1/v2.x2, v1.y1+v2.y1, v1.x2+v2.x2, v1.y2+v2.y2)
    }
}

const down = []

/**
 * Checks if a key is pressed
 * @param {string} key key name
 * @returns {boolean}
 * @link https://github.com/kmamal/node-sdl#virtual-keys
 */
const keydown = key => down.includes(key)


let last = performance.now()
let now = performance.now()
let dt = 0
let lostms = 0

let game = require(path.resolve(chosen))
game.__FRAMERATE = Number(game.__FRAMERATE) !== NaN ? game.__FRAMERATE : 50

for(let y=128;y>0;y--) (new Vector(0,y,128,y)).draw()
for(let x=0;x<128;i++) (new Vector)


game.start.call({Vector,keydown},dt)

let tf = 0
const frame = (1/game.__FRAMERATE)*1000
const fixedupdate = dt => {
    tf = tf + dt
    if(tf >= frame) {
        for(let i=0;i<Math.floor(tf/frame);i++) game.fixedupdate.call({Vector,keydown},tf/frame)
        tf = tf - frame * Math.floor(tf/frame)
    }
}

const update = ()=>{
    now=performance.now()
    dt=now-last
    last=now
    lostms=lostms+(dt-(1/game.__FRAMERATE)*1000)
    game.update.call({Vector,keydown},dt)
    fixedupdate(dt)
    sharp(canvas.toBuffer('image/jpeg')).resize({width:window.width,height:window.height}).raw().toBuffer().then(buf=>{
        if(window.destroyed) return
        window.render(window.width,window.height,window.width*3,'rgb24',buf)
        ctx.clearRect(0,0,window.width,window.height)
    })
}


const int = setInterval(update,(1/game.__FRAMERATE)*1000)

window.on('close',()=>{
    game.end.call({Vector,keydown},dt)
    clearInterval(int)
})
window.on('keyDown',event=>{
    if(window.focused && !down.includes(event.key)) down.push(event.key)
})
window.on('keyUp',event=>{
    if(down.indexOf(event.key)>-1) down.splice(down.indexOf(event.key),1)
})
window.focus()