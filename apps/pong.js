const __FRAMERATE = 30

const height = 30
let y1 = 64
let y2 = 64

let p1=0
let p2=0


let bspeed = 1
let xb = 64
let yb = 64
let xbd = -1
let ybd = -1


function start() {}
function end() {}

let a = 0
async function fixedupdate(o) {
    a++
    if(a<50) return //waits 1 second
    a=50
    if(y1-height/2 < 0) y1 = height/2
    if(y1+height/2 > 128) y1 = 128-height/2
    if(y2-height/2 < 0) y2 = height/2
    if(y2+height/2 > 128) y2 = 128-height/2


    const pad = new this.Vector(10,y1-height/2,10,y1+height/2)
    if(this.keydown('w')) y1=y1+3
    if(this.keydown('s')) y1=y1-3
    pad.draw()

    const pad2 = new this.Vector(118,y2-height/2,118,y2+height/2)
    if(this.keydown('up')) y2=y2+3
    if(this.keydown('down')) y2=y2-3
    pad2.draw()

    const btop = new this.Vector(xb-2,yb+2,xb+2,yb+2)
    const bbottom = new this.Vector(xb-2,yb-2,xb+2,yb-2)
    const bleft = new this.Vector(xb-2,yb-2,xb-2,yb+2)
    const bright = new this.Vector(xb+2,yb-2,xb+2,yb+2)
    for(const a of[btop,bbottom,bleft,bright])a.draw()

    xb=xb+(bspeed/Math.floor(o))*xbd
    yb=yb+(bspeed/Math.floor(o))*ybd
    if(this.Vector.isEdgeTouching(bleft,pad)) xbd = 1
    if(this.Vector.isEdgeTouching(bright,pad2)) xbd = -1


    if(this.Vector.isEdgeTouching(btop,new this.Vector(0,128,128,128))) ybd=-1
    if(this.Vector.isEdgeTouching(bbottom,new this.Vector(0,0,128,0))) ybd=1
    if(this.Vector.isEdgeTouching(bleft,new this.Vector(0,0,0,128)) || (xb-2<=0 && (yb-2<=0 || yb+2 >= 128))) {
        p2++
        xbd=-1
        xb=64
        yb=64
        console.log(`Player 1: ${p1}; Player 2: ${p2};`)
    }
    if(this.Vector.isEdgeTouching(bright,new this.Vector(128,0,128,128)) || (xb+2==128 && (yb+2>=128 || yb-2 <= 0))) {
        p1++
        xbd=1
        xb=64
        yb=64
        console.log(`Player 1: ${p1}; Player 2: ${p2};`)
    }
}

function update(){}
module.exports = {start,update,fixedupdate,end,__FRAMERATE}