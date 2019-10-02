let bombRate;
let chunks;

let squareSize = 30;

class square{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.bomb = Math.random() < bombRate;
		this.show = 0;
		this.neighbors = 0;
	}
	draw(ctx, pos){
		let posAdj = {
			x : pos.x + this.x * squareSize,
			y : pos.y + this.y * squareSize
		};

		if(this.show == 0){
			ctx.beginPath();
			ctx.fillStyle = "rgba(100, 100, 100, 255)";
			ctx.strokeStyle = "rgba(50, 50, 50, 255)";
			ctx.rect(posAdj.x, posAdj.y, squareSize, squareSize);
			ctx.fill();
			ctx.stroke();
		}
		if(this.show == 1){
			if(this.bomb == 0){
				ctx.beginPath();
				ctx.fillStyle = "rgba(200, 200, 200, 255)";
				ctx.strokeStyle = "rgba(50, 50, 50, 255)";
				ctx.rect(posAdj.x, posAdj.y, squareSize, squareSize);
				ctx.fill();
				ctx.stroke();
				if(this.neighbors > 0){
					ctx.font = squareSize.toString() + "px Arial";
					ctx.textAlign = "center";
					ctx.fillStyle = "rgba(0, 0, 0, 255)";
					ctx.fillText(this.neighbors, posAdj.x + squareSize / 2, posAdj.y + squareSize * 5 / 6);
				}
			}
			else{
				gameOver = 1;
				ctx.beginPath();
				ctx.fillStyle = "rgba(255, 0, 0, 255)";
				ctx.strokeStyle = "rgba(50, 50, 50, 255)";
				ctx.rect(posAdj.x, posAdj.y, squareSize, squareSize);
				ctx.fill();
				ctx.stroke();
			}
		}
		if(this.show == 2){
			ctx.beginPath();
			ctx.fillStyle = "rgba(255, 127, 0, 255)";
			if(gameOver == 1 && this.bomb == 1){
				ctx.fillStyle = "rgba(255, 63, 0, 255)";
			}
			ctx.strokeStyle = "rgba(50, 50, 50, 255)";
			ctx.rect(posAdj.x, posAdj.y, squareSize, squareSize);
			ctx.fill();
			ctx.stroke();
		}
	}
}



let chunkSize = 15;

class chunk{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.chunk = [];
		for(let i = 0; i < chunkSize; i++){
			let row = [];
			for(let j = 0; j < chunkSize; j++){
				row.push(new square(i, j));
			}
			this.chunk.push(row);
		}
	}
	draw(ctx, pos){
		let posAdj = {
			x : pos.x + this.x * chunkSize * squareSize,
			y : pos.y + this.y * chunkSize * squareSize
		};
		if(posAdj.x + chunkSize * squareSize > 0 && posAdj.x < width    &&    posAdj.y + chunkSize * squareSize > 0 && posAdj.y < height){
			for(let i = 0; i < chunkSize; i++){
				for(let j = 0; j < chunkSize; j++){
					this.chunk[i][j].draw(ctx, posAdj);
				}
			}
			ctx.beginPath();
			ctx.strokeStyle = "rgba(10, 10, 10, 255)";
			ctx.rect(posAdj.x, posAdj.y, chunkSize * squareSize, chunkSize * squareSize);
			ctx.stroke();
		}
	}
	count(){
		let count = 0;
		for(let i = 0; i < chunkSize; i++){
			for(let j = 0; j < chunkSize; j++){
				if(this.chunk[i][j].show == 2){
					count += this.chunk[i][j].bomb * 2 - 1;
				}
			}
		}
		return count;
	}
	attempt(x, y){
		for(let i = 0; i < chunks.length; i++){
			if(chunks[i].x == this.x + x && chunks[i].y == this.y + y){
				return i;
			}
		}
		chunks.push(new chunk(this.x + x, this.y + y));
		return chunks.length - 1;
	}
	show(x, y){
		if(this.chunk[x][y].show == 0){
			this.chunk[x][y].show = 1;
			let type = 0;
			if(x == 0){
				type = 0;
				if(y == 0){
				}
				else if(y == chunkSize - 1){
					type += 6;
				}
				else{
					type += 3;
				}
			}
			else if(x == chunkSize - 1){
				type = 2;
				if(y == 0){
				}
				else if(y == chunkSize - 1){
					type += 6;
				}
				else{
					type += 3;
				}
			}
			else{
				type = 1;
				if(y == 0){
				}
				else if(y == chunkSize - 1){
					type += 6;
				}
				else{
					type += 3;
				}
			}
			let c1 = 0;
			let c2 = 0;
			let c3 = 0;
			this.chunk[x][y].neighbors = 0;
			switch(type){
				case 0:
					c1 = this.attempt(-1,  0);
					c2 = this.attempt(-1, -1);
					c3 = this.attempt( 0, -1);
					this.chunk[x][y].neighbors += chunks[c2].chunk[chunkSize - 1][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[x][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[x + 1][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y + 1].bomb;

					if(this.chunk[x][y].neighbors == 0 && this.chunk[x][y].bomb == 0){
						chunks[c2].show(chunkSize - 1, chunkSize - 1);
						chunks[c3].show(x, chunkSize - 1);
						chunks[c3].show(x + 1, chunkSize - 1);
						chunks[c1].show(chunkSize - 1, y);

						this.show(x + 1, y);
						chunks[c1].show(chunkSize - 1, y + 1);
						this.show(x, y + 1);
						this.show(x + 1, y + 1);
					}
					break;
				case 1:
					c1 = this.attempt( 0, -1);
					this.chunk[x][y].neighbors += chunks[c1].chunk[x - 1][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x + 1][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y + 1].bomb;

					if(this.chunk[x][y].neighbors == 0 && this.chunk[x][y].bomb == 0){
						chunks[c1].show(x - 1, chunkSize - 1);
						chunks[c1].show(x, chunkSize - 1);
						chunks[c1].show(x + 1, chunkSize - 1);
						this.show(x - 1, y);

						this.show(x + 1, y);
						this.show(x - 1, y + 1);
						this.show(x, y + 1);
						this.show(x + 1, y + 1);
					}
					break;
				case 2:
					c1 = this.attempt( 0, -1);
					c2 = this.attempt( 1, -1);
					c3 = this.attempt( 1,  0);
					this.chunk[x][y].neighbors += chunks[c1].chunk[x - 1][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c2].chunk[0][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += chunks[c3].chunk[0][y].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[0][y + 1].bomb;

					if(this.chunk[x][y].neighbors == 0 && this.chunk[x][y].bomb == 0){
						chunks[c1].show(x - 1, chunkSize - 1);
						chunks[c1].show(x, chunkSize - 1);
						chunks[c2].show(0, chunkSize - 1);
						this.show(x - 1, y);

						chunks[c3].show(0, y);
						this.show(x - 1, y + 1);
						this.show(x, y + 1);
						chunks[c3].show(0, y + 1);
					}
					break;
				case 3:
					c1 = this.attempt(-1,  0);
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y + 1].bomb;

					if(this.chunk[x][y].neighbors == 0 && this.chunk[x][y].bomb == 0){
						chunks[c1].show(chunkSize - 1, y - 1);
						this.show(x, y - 1);
						this.show(x + 1, y - 1);
						chunks[c1].show(chunkSize - 1, y);

						this.show(x + 1, y);
						chunks[c1].show(chunkSize - 1, y + 1);
						this.show(x, y + 1);
						this.show(x + 1, y + 1);
					}
					break;
				case 4:
					this.chunk[x][y].neighbors += this.chunk[x - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y + 1].bomb;

					if(this.chunk[x][y].neighbors == 0 && this.chunk[x][y].bomb == 0){
						this.show(x - 1, y - 1);
						this.show(x, y - 1);
						this.show(x + 1, y - 1);
						this.show(x - 1, y);

						this.show(x + 1, y);
						this.show(x - 1, y + 1);
						this.show(x, y + 1);
						this.show(x + 1, y + 1);
					}
					break;
				case 5:
					c1 = this.attempt( 1,  0);
					this.chunk[x][y].neighbors += this.chunk[x - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[0][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += chunks[c1].chunk[0][y].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[0][y + 1].bomb;

					if(this.chunk[x][y].neighbors == 0 && this.chunk[x][y].bomb == 0){
						this.show(x - 1, y - 1);
						this.show(x, y - 1);
						chunks[c1].show(0, y - 1);
						this.show(x - 1, y);

						chunks[c1].show(0, y);
						this.show(x - 1, y + 1);
						this.show(x, y + 1);
						chunks[c1].show(0, y + 1);
					}
					break;
				case 6:
					c1 = this.attempt(-1,  0);
					c2 = this.attempt(-1,  1);
					c3 = this.attempt( 0,  1);
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += chunks[c2].chunk[chunkSize - 1][0].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[x][0].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[x + 1][0].bomb;

					if(this.chunk[x][y].neighbors == 0 && this.chunk[x][y].bomb == 0){
						chunks[c1].show(chunkSize - 1, y - 1);
						this.show(x, y - 1);
						this.show(x + 1, y - 1);
						chunks[c1].show(chunkSize - 1, y);

						this.show(x + 1, y);
						chunks[c2].show(chunkSize - 1, 0);
						chunks[c3].show(x, 0);
						chunks[c3].show(x + 1, 0);
					}
					break;
				case 7:
					c1 = this.attempt( 0,  1);
					this.chunk[x][y].neighbors += this.chunk[x - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x - 1][0].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x][0].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x + 1][0].bomb;

					if(this.chunk[x][y].neighbors == 0 && this.chunk[x][y].bomb == 0){
						this.show(x - 1, y - 1);
						this.show(x, y - 1);
						this.show(x + 1, y - 1);
						this.show(x - 1, y);

						this.show(x + 1, y);
						chunks[c1].show(x - 1, 0);
						chunks[c1].show(x, 0);
						chunks[c1].show(x + 1, 0);
					}
					break;
				case 8:
					c1 = this.attempt( 0,  1);
					c2 = this.attempt( 1,  1);
					c3 = this.attempt( 1,  0);
					this.chunk[x][y].neighbors += this.chunk[x - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[0][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += chunks[c3].chunk[0][y].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x - 1][0].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x][0].bomb;
					this.chunk[x][y].neighbors += chunks[c2].chunk[0][0].bomb;

					if(this.chunk[x][y].neighbors == 0 && this.chunk[x][y].bomb == 0){
						this.show(x - 1, y - 1);
						this.show(x, y - 1);
						chunks[c3].show(0, y - 1);
						this.show(x - 1, y);

						chunks[c3].show(0, y);
						chunks[c1].show(x - 1, 0);
						chunks[c1].show(x, 0);
						chunks[c2].show(0, 0);
					}
					break;
				default:
					break;
			}
		}
	}
	clear(x, y){
		if(this.chunk[x][y].show == 1){
			let type = 0;
			if(x == 0){
				type = 0;
				if(y == 0){
				}
				else if(y == chunkSize - 1){
					type += 6;
				}
				else{
					type += 3;
				}
			}
			else if(x == chunkSize - 1){
				type = 2;
				if(y == 0){
				}
				else if(y == chunkSize - 1){
					type += 6;
				}
				else{
					type += 3;
				}
			}
			else{
				type = 1;
				if(y == 0){
				}
				else if(y == chunkSize - 1){
					type += 6;
				}
				else{
					type += 3;
				}
			}
			let c1 = 0;
			let c2 = 0;
			let c3 = 0;
			let flags = 0;
			this.chunk[x][y].neighbors = 0;
			switch(type){
				case 0:
					c1 = this.attempt(-1,  0);
					c2 = this.attempt(-1, -1);
					c3 = this.attempt( 0, -1);
					this.chunk[x][y].neighbors += chunks[c2].chunk[chunkSize - 1][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[x][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[x + 1][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y + 1].bomb;

					flags += Math.floor(chunks[c2].chunk[chunkSize - 1][chunkSize - 1].show / 2);
					flags += Math.floor(chunks[c3].chunk[x][chunkSize - 1].show / 2);
					flags += Math.floor(chunks[c3].chunk[x + 1][chunkSize - 1].show / 2);
					flags += Math.floor(chunks[c1].chunk[chunkSize - 1][y].show / 2);

					flags += Math.floor(this.chunk[x + 1][y].show / 2);
					flags += Math.floor(chunks[c1].chunk[chunkSize - 1][y + 1].show / 2);
					flags += Math.floor(this.chunk[x][y + 1].show / 2);
					flags += Math.floor(this.chunk[x + 1][y + 1].show / 2);

					if(this.chunk[x][y].neighbors == flags){
						chunks[c2].show(chunkSize - 1, chunkSize - 1);
						chunks[c3].show(x, chunkSize - 1);
						chunks[c3].show(x + 1, chunkSize - 1);
						chunks[c1].show(chunkSize - 1, y);

						this.show(x + 1, y);
						chunks[c1].show(chunkSize - 1, y + 1);
						this.show(x, y + 1);
						this.show(x + 1, y + 1);
					}
					break;
				case 1:
					c1 = this.attempt( 0, -1);
					this.chunk[x][y].neighbors += chunks[c1].chunk[x - 1][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x + 1][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y + 1].bomb;

					flags += Math.floor(chunks[c1].chunk[x - 1][chunkSize - 1].show / 2);
					flags += Math.floor(chunks[c1].chunk[x][chunkSize - 1].show / 2);
					flags += Math.floor(chunks[c1].chunk[x + 1][chunkSize - 1].show / 2);
					flags += Math.floor(this.chunk[x - 1][y].show / 2);

					flags += Math.floor(this.chunk[x + 1][y].show / 2);
					flags += Math.floor(this.chunk[x - 1][y + 1].show / 2);
					flags += Math.floor(this.chunk[x][y + 1].show / 2);
					flags += Math.floor(this.chunk[x + 1][y + 1].show / 2);

					if(this.chunk[x][y].neighbors == flags){
						chunks[c1].show(x - 1, chunkSize - 1);
						chunks[c1].show(x, chunkSize - 1);
						chunks[c1].show(x + 1, chunkSize - 1);
						this.show(x - 1, y);

						this.show(x + 1, y);
						this.show(x - 1, y + 1);
						this.show(x, y + 1);
						this.show(x + 1, y + 1);
					}
					break;
				case 2:
					c1 = this.attempt( 0, -1);
					c2 = this.attempt( 1, -1);
					c3 = this.attempt( 1,  0);
					this.chunk[x][y].neighbors += chunks[c1].chunk[x - 1][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c2].chunk[0][chunkSize - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += chunks[c3].chunk[0][y].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[0][y + 1].bomb;

					flags += Math.floor(chunks[c1].chunk[x - 1][chunkSize - 1].show / 2);
					flags += Math.floor(chunks[c1].chunk[x][chunkSize - 1].show / 2);
					flags += Math.floor(chunks[c2].chunk[0][chunkSize - 1].show / 2);
					flags += Math.floor(this.chunk[x - 1][y].show / 2);

					flags += Math.floor(chunks[c3].chunk[0][y].show / 2);
					flags += Math.floor(this.chunk[x - 1][y + 1].show / 2);
					flags += Math.floor(this.chunk[x][y + 1].show / 2);
					flags += Math.floor(chunks[c3].chunk[0][y + 1].show / 2);

					if(this.chunk[x][y].neighbors == flags){
						chunks[c1].show(x - 1, chunkSize - 1);
						chunks[c1].show(x, chunkSize - 1);
						chunks[c2].show(0, chunkSize - 1);
						this.show(x - 1, y);

						chunks[c3].show(0, y);
						this.show(x - 1, y + 1);
						this.show(x, y + 1);
						chunks[c3].show(0, y + 1);
					}
					break;
				case 3:
					c1 = this.attempt(-1,  0);
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y + 1].bomb;

					flags += Math.floor(chunks[c1].chunk[chunkSize - 1][y - 1].show / 2);
					flags += Math.floor(this.chunk[x][y - 1].show / 2);
					flags += Math.floor(this.chunk[x + 1][y - 1].show / 2);
					flags += Math.floor(chunks[c1].chunk[chunkSize - 1][y].show / 2);

					flags += Math.floor(this.chunk[x + 1][y].show / 2);
					flags += Math.floor(chunks[c1].chunk[chunkSize - 1][y + 1].show / 2);
					flags += Math.floor(this.chunk[x][y + 1].show / 2);
					flags += Math.floor(this.chunk[x + 1][y + 1].show / 2);

					if(this.chunk[x][y].neighbors == flags){
						chunks[c1].show(chunkSize - 1, y - 1);
						this.show(x, y - 1);
						this.show(x + 1, y - 1);
						chunks[c1].show(chunkSize - 1, y);

						this.show(x + 1, y);
						chunks[c1].show(chunkSize - 1, y + 1);
						this.show(x, y + 1);
						this.show(x + 1, y + 1);
					}
					break;
				case 4:
					this.chunk[x][y].neighbors += this.chunk[x - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y + 1].bomb;

					flags += Math.floor(this.chunk[x - 1][y - 1].show / 2);
					flags += Math.floor(this.chunk[x][y - 1].show / 2);
					flags += Math.floor(this.chunk[x + 1][y - 1].show / 2);
					flags += Math.floor(this.chunk[x - 1][y].show / 2);

					flags += Math.floor(this.chunk[x + 1][y].show / 2);
					flags += Math.floor(this.chunk[x - 1][y + 1].show / 2);
					flags += Math.floor(this.chunk[x][y + 1].show / 2);
					flags += Math.floor(this.chunk[x + 1][y + 1].show / 2);

					if(this.chunk[x][y].neighbors == flags){
						this.show(x - 1, y - 1);
						this.show(x, y - 1);
						this.show(x + 1, y - 1);
						this.show(x - 1, y);

						this.show(x + 1, y);
						this.show(x - 1, y + 1);
						this.show(x, y + 1);
						this.show(x + 1, y + 1);
					}
					break;
				case 5:
					c1 = this.attempt( 1,  0);
					this.chunk[x][y].neighbors += this.chunk[x - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[0][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += chunks[c1].chunk[0][y].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y + 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y + 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[0][y + 1].bomb;

					flags += Math.floor(this.chunk[x - 1][y - 1].show / 2);
					flags += Math.floor(this.chunk[x][y - 1].show / 2);
					flags += Math.floor(chunks[c1].chunk[0][y - 1].show / 2);
					flags += Math.floor(this.chunk[x - 1][y].show / 2);

					flags += Math.floor(chunks[c1].chunk[0][y].show / 2);
					flags += Math.floor(this.chunk[x - 1][y + 1].show / 2);
					flags += Math.floor(this.chunk[x][y + 1].show / 2);
					flags += Math.floor(chunks[c1].chunk[0][y + 1].show / 2);

					if(this.chunk[x][y].neighbors == flags){
						this.show(x - 1, y - 1);
						this.show(x, y - 1);
						chunks[c1].show(0, y - 1);
						this.show(x - 1, y);

						chunks[c1].show(0, y);
						this.show(x - 1, y + 1);
						this.show(x, y + 1);
						chunks[c1].show(0, y + 1);
					}
					break;
				case 6:
					c1 = this.attempt(-1,  0);
					c2 = this.attempt(-1,  1);
					c3 = this.attempt( 0,  1);
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[chunkSize - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += chunks[c2].chunk[chunkSize - 1][0].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[x][0].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[x + 1][0].bomb;

					flags += Math.floor(chunks[c1].chunk[chunkSize - 1][y - 1].show / 2);
					flags += Math.floor(this.chunk[x][y - 1].show / 2);
					flags += Math.floor(this.chunk[x + 1][y - 1].show / 2);
					flags += Math.floor(chunks[c1].chunk[chunkSize - 1][y].show / 2);

					flags += Math.floor(this.chunk[x + 1][y].show / 2);
					flags += Math.floor(chunks[c2].chunk[chunkSize - 1][0].show / 2);
					flags += Math.floor(chunks[c3].chunk[x][0].show / 2);
					flags += Math.floor(chunks[c3].chunk[x + 1][0].show / 2);

					if(this.chunk[x][y].neighbors == flags){
						chunks[c1].show(chunkSize - 1, y - 1);
						this.show(x, y - 1);
						this.show(x + 1, y - 1);
						chunks[c1].show(chunkSize - 1, y);

						this.show(x + 1, y);
						chunks[c2].show(chunkSize - 1, 0);
						chunks[c3].show(x, 0);
						chunks[c3].show(x + 1, 0);
					}
					break;
				case 7:
					c1 = this.attempt( 0,  1);
					this.chunk[x][y].neighbors += this.chunk[x - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x + 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += this.chunk[x + 1][y].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x - 1][0].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x][0].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x + 1][0].bomb;

					flags += Math.floor(this.chunk[x - 1][y - 1].show / 2);
					flags += Math.floor(this.chunk[x][y - 1].show / 2);
					flags += Math.floor(this.chunk[x + 1][y - 1].show / 2);
					flags += Math.floor(this.chunk[x - 1][y].show / 2);

					flags += Math.floor(this.chunk[x + 1][y].show / 2);
					flags += Math.floor(chunks[c1].chunk[x - 1][0].show / 2);
					flags += Math.floor(chunks[c1].chunk[x][0].show / 2);
					flags += Math.floor(chunks[c1].chunk[x + 1][0].show / 2);

					if(this.chunk[x][y].neighbors == flags){
						this.show(x - 1, y - 1);
						this.show(x, y - 1);
						this.show(x + 1, y - 1);
						this.show(x - 1, y);

						this.show(x + 1, y);
						chunks[c1].show(x - 1, 0);
						chunks[c1].show(x, 0);
						chunks[c1].show(x + 1, 0);
					}
					break;
				case 8:
					c1 = this.attempt( 0,  1);
					c2 = this.attempt( 1,  1);
					c3 = this.attempt( 1,  0);
					this.chunk[x][y].neighbors += this.chunk[x - 1][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x][y - 1].bomb;
					this.chunk[x][y].neighbors += chunks[c3].chunk[0][y - 1].bomb;
					this.chunk[x][y].neighbors += this.chunk[x - 1][y].bomb;

					this.chunk[x][y].neighbors += chunks[c3].chunk[0][y].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x - 1][0].bomb;
					this.chunk[x][y].neighbors += chunks[c1].chunk[x][0].bomb;
					this.chunk[x][y].neighbors += chunks[c2].chunk[0][0].bomb;

					flags += Math.floor(this.chunk[x - 1][y - 1].show / 2);
					flags += Math.floor(this.chunk[x][y - 1].show / 2);
					flags += Math.floor(chunks[c3].chunk[0][y - 1].show / 2);
					flags += Math.floor(this.chunk[x - 1][y].show / 2);

					flags += Math.floor(chunks[c3].chunk[0][y].show / 2);
					flags += Math.floor(chunks[c1].chunk[x - 1][0].show / 2);
					flags += Math.floor(chunks[c1].chunk[x][0].show / 2);
					flags += Math.floor(chunks[c2].chunk[0][0].show / 2);

					if(this.chunk[x][y].neighbors == flags){
						this.show(x - 1, y - 1);
						this.show(x, y - 1);
						chunks[c3].show(0, y - 1);
						this.show(x - 1, y);

						chunks[c3].show(0, y);
						chunks[c1].show(x - 1, 0);
						chunks[c1].show(x, 0);
						chunks[c2].show(0, 0);
					}
					break;
				default:
					break;
			}
		}
	}
	breakClick(x, y){
		let xAdj = Math.floor(x / squareSize);
		let yAdj = Math.floor(y / squareSize);
		this.show(xAdj, yAdj);
	}
	clearClick(x, y){
		let xAdj = Math.floor(x / squareSize);
		let yAdj = Math.floor(y / squareSize);
		this.clear(xAdj, yAdj);
	}
	markClick(x, y){
		let xAdj = Math.floor(x / squareSize);
		let yAdj = Math.floor(y / squareSize);
		if(this.chunk[xAdj][yAdj].show == 0){
			this.chunk[xAdj][yAdj].show = 2;
		}
		else if(this.chunk[xAdj][yAdj].show == 2){
			this.chunk[xAdj][yAdj].show = 0;
		}
	}
}