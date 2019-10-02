let width = window.innerWidth - 20;
let height = window.innerHeight - 20;
let canvas = document.createElement("CANVAS");
canvas.width = width;
canvas.height = height;
let ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

let gameOver = 0;
let score = 0;

ctx.beginPath();
ctx.rect(0, 0, width, height);
ctx.stroke();

let lastPos = {
	x : 0,
	y : 0
};

let pos = {
	x : 0,
	y : 0
};

function clear(){
	ctx.beginPath();
	ctx.fillStyle = "rgba(255, 255, 255, 255)";
	ctx.strokeStyle = "rgba(0, 0, 0, 255)";
	ctx.rect(0, 0, width, height);
	ctx.fill();
	ctx.stroke();
}

function update(){
	clear();
	for(let i = 0; i < chunks.length; i++){
		chunks[i].draw(ctx, pos);
	}
	if(gameOver == 1){
		if(score == 0){
			for(let i = 0; i < chunks.length; i++){
				score += chunks[i].count();
			}
		}
		ctx.beginPath();
		ctx.font = "60px Arial";
		ctx.textAlign = "left";
		ctx.fillStyle = "rgba(0, 0, 255, 255)";
		ctx.fillText(score, 20, 60);
	}
}