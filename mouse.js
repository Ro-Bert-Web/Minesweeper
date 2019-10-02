
let click = {
	x : 0,
	y : 0,
	clk : 0
};

let mousePos = {
	x : 0,
	y : 0
};

let drag = {
	x : 0,
	y : 0,
	d : 0
};

document.onmousewheel = function(event){
	lastPos = {
		x : (pos.x - mousePos.x) * (squareSize + event.wheelDelta / 40) / squareSize + mousePos.x,
		y : (pos.y - mousePos.y) * (squareSize + event.wheelDelta / 40) / squareSize + mousePos.y
	};
	pos = lastPos;
	squareSize += event.wheelDelta / 40;
}

document.onmousedown = function(event){
	click = {
		x : event.clientX - 8,
		y : event.clientY - 8,
		clk : 1
	};
};

document.onmouseup = function(event){
	lastPos = pos;
	if(drag.d < (squareSize / 2)){
		clickEvent(mousePos.x, mousePos.y, event.button);
	}
	click = {
		x : event.clientX - 8,
		y : event.clientY - 8,
		clk : 0
	};
};

document.onmousemove = function(event){
	mousePos = {
		x : event.clientX - 8,
		y : event.clientY - 8
	};
	if(click.clk == 1){
		drag = {
			x : mousePos.x - click.x,
			y : mousePos.y - click.y,
			d : Math.sqrt(Math.pow(mousePos.x - click.x, 2) + Math.pow(mousePos.y - click.y, 2))
		};
		if(drag.d > (squareSize / 2)){
			pos = {
				x : lastPos.x + drag.x,
				y : lastPos.y + drag.y
			};
		}
	}
	else{
		drag = {
			x : 0,
			y : 0,
			d : 0
		};
	}
};
