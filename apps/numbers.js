//2x4

const numbers = [
    [//0
        [0,0,0,4],
        [0,4,2,4],
        [2,4,2,0],
        [2,0,0,0]
    ],
    [//1
        [2,4,2,0]
    ],
    [//2
        [0,4,2,4],
        [2,4,0,0],
        [0,0,2,0]
    ],
    [//3
        [0,4,2,4],
        [2,4,1,2],
        [1,2,2,0],
        [2,0,0,0]
    ],
    [//4
        [0,4,0,2],
        [0,2,2,2],
        [2,4,2,0]
    ],
    [//5
        [0,4,2,4],
        [0,0,2,0],
        [0,4,2,0]
    ],
    [//6
        [0,4,0,0],
        [0,0,2,0],
        [2,0,2,2],
        [2,2,0,2]
    ],
    [//7
        [0,4,2,4],
        [2,4,1,0]
    ],
    [//8
        [0,4,2,4],
        [0,4,2,0],
        [0,0,2,4],
        [2,0,0,0]
    ],
    [//9
        [0,4,2,4],
        [0,4,0,2],
        [0,2,2,2],
        [2,0,2,4]
    ]
]


//test

let x = 90
let y = 90

function start(){
    
}

function end(){
    
}

function fixedupdate(){

}


function update(dt) {
    for(const n in numbers) {
        for(const str of numbers[n]) {
            const v = this.Vector.add(this.Vector.mul(new this.Vector(...str),new this.Vector(2,2,2,2)),new this.Vector(x,y,x,y))
            v.draw()
        }
        x=x-9
    }
    x=90
}
module.exports = {start,update,fixedupdate,end}