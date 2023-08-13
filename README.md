# vectron
simple vector-based game engine, made with node-sdl

the engine itself runs on 128x128 resolution, but rescales to fit current window

## basic usage

`node index.js path`, where path is the path to the app file

if no path is specified, it will default to `apps/demo.js`

## api reference

apps run at 50 FPS by default, that can be changed by setting `__FRAMERATE` and including in the export

- ```js
  class Vector
  ```
  - basic line segment object
    
  - ```js
    constructor(Number x1,Number y1,Number x2,Number y2): Vector
    ```
  - Vector.prototype.draw()
    - Renders a white line segment from (x1,y1) to (x2,y2)
    - **A line segment is only rendered for 1 frame**
      
  - Vector.intersect(Vector v1,Vector v2) 
    - Checks if v1 intersects with v2
      
  - Vector.isBetween(Vector v1, {x: Number, y: Number})
    - Checks if point (x,y) is part of v1
      
  - Vector.isEdgeTouching(Vector v1, Vector v2)
    - Checks if any of both edges from v1 touch any point from v2
  - Vector.(add/sub/mul/div)(Vector v1, Vector v2)
    - Adds, subtracts, multiplies or divide v1 by v2
   
- ```js
  keydown(String key): Boolean
  ```
    - Checks if that key is pressed. [Keys from node-sdl](https://github.com/kmamal/node-sdl#virtual-keys)
 
## events
every single event gets runs with `this` set to `{Vector,keydown}`, so both Vector and keydown are only accessible from inside the functions

- ```js
  start()
  ```
  - This function only runs once, at the start of the execution of the app
- ```js
  update(dt)
  ```
  - This function executes every frame of the app, with a deltaTime argument
 
- ```js
  fixedupdate(fdt)
  ```
  - This function executes with a constant framerate, regardless of the current window framerate, with a fixedDeltaTime argument
- ```js
  end()
  ```
  - This function executes before the current window closes (great for destroying Speaker instances)
 
## example app
```js
//generates lines randomly scattered around the screen

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
```
i suck at explaining shit ongodd
