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
    index(x, y) {
        return x + y * this.w;
    }
    coords(i) {
        var x = i % this.w;
        return [x, (i - x)/this.w];
    }
    get max() {
        return this.index(this.w-1, this.h-1)+1;
    }
    draw() {
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.1;
        ctx.strokeRect(0, 0, this.w, this.h);

        if(showGrid) for(let i = 0; i < this.max; i++) {
            var [x, y] = this.coords(i);
            ctx.strokeRect(x, y, 1, 1);
        }
    }
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

		if(wallKill) {
			if(x <  0) snake.dead = 1;
			if(x >= w) snake.dead = 1;
			if(y <  0) snake.dead = 1;
			if(y >= h) snake.dead = 1;
		}else{
			if(x <  0) x += w;
			if(x >= w) x -= w;
			if(y <  0) y += h;
			if(y >= h) y -= h;
		}

		if(this.includes(head)) {
			this.dead = true;
		}
		if(!this.dead) {
			head = map.index(x, y);
			this.unshift(head);
		}

		this.lastDir = dir;
	}
	dir = 0;
	lastDir = 0;
}
var binds = {
	KeyD: 0,
	KeyW: 1,
	KeyA: 2,
	KeyS: 3,
	ArrowRight: 0,
	ArrowUp:    1,
	ArrowLeft:  2,
	ArrowDown:  3
};
onkeydown = ({code}) => {
	if(code in binds) {
		var dir = binds[code];
		
		if(Math.abs(snake.lastDir - dir) != 2) {
			snake.dir = dir;
		}
	}

	if(snake.dead && code == "Space") {
		init();
	}
}

var map = new TileMap(15, 15);
var snake = new Snake(0);
var apple;
var ID;
var randomTile = () => Math.floor(Math.random() * map.max);

var wallKill = 1;
var showGrid = 1;

function init() {
	snake = new Snake(0, 0, 0);
	apple = randomTile();

	loop();
}
function loop() {
	snake.move(snake.dir);
	if(snake[0] == apple) {
		let tail = snake[snake.length - 1];
		snake.push(tail, tail);
		do{
			apple = randomTile();
		}while(snake.includes(apple));
	}

	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.translate((canvas.width-35*map.w)/2, (canvas.height-35*map.h)/2);
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