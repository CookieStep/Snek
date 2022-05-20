var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

onload = () => {
	document.body.appendChild(canvas);
	onresize();
	init();
};
onresize = () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
};

class TileMap{
    constructor(w=1, h=1) {
        this.w = w;
        this.h = h;
    }
    tiles = [];
    index(x, y) {
        return x + y * this.w;
    }
    coords(i) {
        var x = i % this.w;
        return [x, (i - x)/this.w];
    }
    out(x, y) {
        return (x < 0) || (y < 0) || (x >= this.w) || (y >= this.h);
    }
    range(i) {
        return (i >= 0) && (i < this.max);
    }
    get(x, y) {
        // if(this.out(x, y)) throw TileMap.outOfBounds;
        return this.tiles[this.index(x, y)];
    }
    set(x, y, v) {
        if(this.out(x, y)) throw TileMap.outOfBounds;
        return this.tiles[this.index(x, y)] = v;
    }
    get max() {
        return this.index(this.w-1, this.h-1)+1;
    }
    draw() {
        var a = this.tiles;
        var l = a.length;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.1;
        for(let i = 0; i < l; i++) {
            var [x, y] = this.coords(i);
            if(a[i]) {
                if(a[i] == 1) {
                    ctx.fillStyle = "black";
                }
                if(typeof a[i] == "object") {
                    ctx.fillStyle = a[i].color || "yellow";
                }
                ctx.fillRect(x, y, 1, 1);
            }
        }
        ctx.strokeRect(0, 0, this.w, this.h);
        // for(let i = 0; i < this.max; i++) {
        //     var [x, y] = this.coords(i);
        //     ctx.strokeRect(x, y, 1, 1);
        // }
    }
    update() {
        var a = this.tiles;
        var l = this.max;
        var b = [];
        var c = [];
        for(let i = 0; i < l; i++) {
            if(a[i]) b.push(i);
            else     c.push(i);
        }
        this.blocks = b;
        this.air = c;
    }
    static outOfBounds = new RangeError("Tile coordinates are out of bounds!");
}
class Snake extends Array{
	move(dir) {
		var head = this[0];
		this.pop();

		var [x, y] = map.coords(head);
		var {w, h} = map;
		if(dir == 0) ++x;
		if(dir == 1) --y;
		if(dir == 2) --x;
		if(dir == 3) ++y;
		if(x <  0) x += w;
		if(x >= w) x -= w;
		if(y <  0) y += h;
		if(y >= h) y -= h;
		head = map.index(x, y);
		if(this.includes(head)) {
			this.dead = true;
		}

		this.unshift(head);
		this.lastDir = dir;
	}
	dir = 0;
	lastDir = 0;
}
onkeydown = ({code}) => {
	var dir = -1;

	if(code == "KeyD") dir = 0;
	if(code == "KeyW") dir = 1;
	if(code == "KeyA") dir = 2;
	if(code == "KeyS") dir = 3;

	if(code == "ArrowRight") dir = 0;
	if(code == "ArrowUp") dir = 1;
	if(code == "ArrowLeft") dir = 2;
	if(code == "ArrowDown") dir = 3;

	if(dir != -1 && Math.abs(snake.lastDir - dir) != 2) {
		snake.dir = dir;
	}

	if(snake.dead && code == "Space") {
		init();
	}
}

var map = new TileMap(15, 15);
var snake = new Snake(0);
var apple;
var ID;
function init() {
	snake = new Snake(0, 0, 0);
	apple = Math.floor(Math.random() * map.max);

	loop();
}
function loop() {
	snake.move(snake.dir);
	if(snake[0] == apple) {
		let tail = snake[snake.length - 1];
		snake.push(tail, tail);
		do{
			apple = Math.floor(Math.random() * map.max);
		}while(snake.includes(apple));
	}

	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.scale(35, 35);
	map.draw();
	ctx.fillStyle = snake.dead? "#f70": "#0f0";
	for(let i of snake) {
		let [x, y] = map.coords(i);
		ctx.fillRect(x, y, 1, 1);
	}
	{
		let [x, y] = map.coords(apple);
		ctx.fillStyle = "#f00";
		ctx.fillRect(x, y, 1, 1);
	}

	ctx.resetTransform();
	if(!snake.dead) {
		setTimeout(loop, 150);
	}
}