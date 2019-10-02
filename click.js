function clickEvent(x, y, b){
	if(gameOver == 0){
		let xAdj = x - pos.x;
		let yAdj = y - pos.y;
		for(let i = 0; i < chunks.length; i++){
			if(chunks[i].x == Math.floor(xAdj / chunkSize / squareSize) && chunks[i].y == Math.floor(yAdj / chunkSize / squareSize)){
				xAdj -= chunks[i].x * chunkSize * squareSize;
				yAdj -= chunks[i].y * chunkSize * squareSize;
				if(b == 0){
					chunks[i].markClick(xAdj, yAdj);
					chunks[i].clearClick(xAdj, yAdj);
				}
				else{
					chunks[i].breakClick(xAdj, yAdj);
				}
				break;
			}
		}
	}
}