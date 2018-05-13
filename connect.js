var ctx = document.getElementById('canvas').getContext('2d'), BOARD, WIDTH = 7, HEIGHT = 6, winLength = 4, com = 'simple';
//<button onclick="winLength = parseInt(window.prompt('Enter the length of a chain needed to win\n(Default value is 4)'))">Length to Win</button>
//<button onclick="save()">Save Board</button><button onclick="load()">Load Board</button><br>
class Board{
	constructor(width, height, fill){
		this.board = matrix(width, height, fill);
		this.current = 1;
		this.winLength = winLength;
		this.lastPlayed = 0;
		this.width = width;
		this.height = height;
		this.update();
		for (let i = 0; i < width; i++){
			var button = document.createElement('button');
			button.innerHTML = i;
			button.className = 'button';
			button.addEventListener('click', function(){
				BOARD.placeToken(i);
			});
			button.style = "width: 100px; height: 100px";
			document.body.insertBefore(button, document.getElementById('br'));
		}
	}

 	changePlayer(){
 		this.current = this.current === 1 ? 2 : 1;
 		if (this.current === 2){
 			if (com === 'random'){
 				this.placeToken(Math.floor(Math.random()*this.width));
 			}else if (com === 'simple'){
 				this.placeToken(this.comSimple());
 			}
 		}
 	}

	placeToken(ind){
		this.lastPlayed = ind;
		if (this.board[0][ind] !== 0){
			alert('You can\'t put another token here');
			return;
		}
		for (var i = HEIGHT-1; i > -1; i--){
			if (this.board[i][ind] === 0){
				this.board[i][ind] = this.current;
				break;
			}
		}
		this.update();
		this.checkForWin();
	}

	checkForWin(){
		for (var i = 0; i < this.width; i++){
			for (var j = 0; j < this.height; j++){
				if (j+this.winLength-1 <= this.height-1){
					if (this.checkLine(j, i, 'vert', this.winLength, 1)){
						this.win();
						return;
					}
				}
				if (i+this.winLength-1 <= this.width-1){
					if (this.checkLine(j, i, 'horiz', this.winLength, 1)){
						this.win();
						return;
					}
				}
				if (i+this.winLength-1 <= this.width-1 && j+this.winLength-1 <= this.height-1){
					if (this.checkLine(j, i, 'diag1', this.winLength, 1)){
						this.win();
						return;
					}
				}
				if (j+this.winLength-1 <= this.height-1){
					if (this.checkLine(j, i, 'diag2', this.winLength, 1)){
						this.win();
						return;
					}
				}
			}
		}
		this.changePlayer();
	}

	checkLine(y, x, orientation, length, player){
		for (var k = 0; k < length; k++){
			if (orientation === 'horiz' && this.board[y][x+k] !== player){
				return false;
			}else if (orientation === 'vert' && this.board[y+k][x] !== player){
				return false;
			}else if (orientation === 'diag1' && this.board[y+k][x+k] !== player){
				return false;
			}else if (orientation === 'diag2' && this.board[y+k][x-k] !== player){
				return false;
			}
		}
		return true;
	}

	update(){
		for (var i = 0; i < this.width; i++){
			for (var j = 0; j < HEIGHT; j++){
				if (this.board[j][i] === 1){
					ctx.fillStyle = '#FB1E03FF';
					ctx.fillRect(i*100, j*100, 100, 100);
				}else if (this.board[j][i] === 2){
					ctx.fillStyle = '#030BFBFF';
					ctx.fillRect(i*100, j*100, 100, 100);
				}else{
					ctx.fillStyle = '#FFFFFFFF';
					ctx.fillRect(i*100, j*100, 100, 100);
					ctx.strokeStyle = '#000000FF';
					ctx.strokeRect(i*100, j*100, 100, 100);
				}
			}
		}
	}

	reset(){
		this.board = matrix(this.board[0].length, this.board.length, 0);
		this.current = 1;
		this.update();
		reload();
	}
	
	win(){
		alert('Player '+this.current+' wins!');
		localStorage.setItem('wins'+this.current, parseInt(localStorage.getItem('wins'+this.current))+1);
		this.reset();
	}

	comSimple(){
		switch(Math.floor(Math.random()*3)){
			case 0:
				if (this.lastPlayed-1 >= 0){
					return this.lastPlayed-1;
				}else{
					return this.lastPlayed;
				}
			case 1:
				return this.lastPlayed;
			case 2:
				if (this.lastPlayed+1 < this.width){
					return this.lastPlayed+1;
				}else{
					return this.lastPlayed;
				}
		}
	}
}

function matrix(width, height, fill){
	let tmp = [];
	for (var i = 0; i < height; i++){
		tmp.push(new Array(width).fill(fill));
	}
	return tmp;
}

function start(){
	if (isNaN(parseInt(WIDTH))){
		WIDTH = 7;
	}
	if (isNaN(parseInt(HEIGHT))){
		HEIGHT = 6;
	}
	if (isNaN(parseInt(winLength))){
		winLength = 4;
	}
	document.getElementById('canvas').width = WIDTH*100;
	document.getElementById('canvas').height = HEIGHT*100;
	if (BOARD !== undefined){
		for (var i = 0; i < BOARD.width; i++){
			document.getElementsByClassName('button')[0].parentNode.removeChild(document.getElementsByClassName('button')[0]);
		}
	}
	BOARD = new Board(WIDTH, HEIGHT, 0);
}

function reload(){
	if (localStorage.getItem('wins1') === null){
		localStorage.setItem('wins1', 0); 
	}
	if (localStorage.getItem('wins2') === null){
		localStorage.setItem('wins2', 0); 
	}
	document.getElementById('playerWins').innerHTML = 'Wins: '+localStorage.getItem('wins1');
	document.getElementById('playerLoss').innerHTML = 'Losses: '+localStorage.getItem('wins2');
	if (isNaN(100*parseInt(localStorage.getItem('wins1'))/(parseInt(localStorage.getItem('wins1'))+parseInt(localStorage.getItem('wins2'))))){
		document.getElementById('winRate').innerHTML = 'Winrate: 0%';	
	}else{
		document.getElementById('winRate').innerHTML = 'Winrate: '+(Math.floor(10000*parseInt(localStorage.getItem('wins1'))/(parseInt(localStorage.getItem('wins1'))+parseInt(localStorage.getItem('wins2'))))/100) + '%';
	}
}

function save(){
	if (BOARD !== undefined){
		localStorage.setItem('board', JSON.stringify(BOARD));
	}
}

function load(){
	b = JSON.parse(localStorage.getItem('board'));
	console.log(b);
	WIDTH = b.board[0].length;
	HEIGHT = b.board.length;
	winLength = b.winLength;
	start();
	BOARD.current = b.current;
	BOARD.board = b.board;
	BOARD.update();
}