const __FRAMERATE = 50
const start=()=>{}
const end=()=>{}
const fixedupdate=()=>{}
function update(){
    const r=()=>Math.floor(Math.random()*128)
    const v = new this.Vector(r(),r(),r(),r())
    console.log(v)
    v.draw()
}
module.exports={start,end,fixedupdate,update,__FRAMERATE}