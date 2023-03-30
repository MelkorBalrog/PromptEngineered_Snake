// variables for game logic 
var canvas = document.getElementById("game-board"); 
const scoreBox = document.getElementById("score-box");
var ctx = canvas.getContext("2d"); 

let snake = {
	body: [{x: 150, y: 150},{x: 150, y: 140}], 
	dx: 0, 
	dy: 10, 
	currentDirection: "down", 
	BlockFillStyle: 'lightgreen', 
	BlockStrokeStyle: 'darkgreen',
	score: 0,
	size: 10
	};

var foodX = 0; 
var foodY = 10; 
var speed = 100;
let game = setInterval(gameLoop, speed);

const pauseButton = document.getElementById('pause-button');
var startTime = Date.now();
var timeTaken = 0;
// array to store the positions of the blocks
var blocks = [];
var initialize = true;
// create an empty array to store the obstacles
let obstacles = [];
var colorLookupTable = [
	["#B0BF1A", "#3B7A57"],
	["#F19CBB", "#E52B50"],
	["#E32636", "#AF002A"],
	["#426cf5", "#42f5ef"]
	];
 
var randomSnakes = [
	{body: [{x: 150, y: 150},{x: 150, y: 140}], 
	dx: 10, 
	dy: 10, 
	currentDirection: "down", 
	BlockFillStyle: '#'+Math.floor(Math.random()*16777215).toString(16),
	BlockStrokeStyle: '#'+Math.floor(Math.random()*16777215).toString(16),
	score: 0,
	size: 10
	}];
	
var enemies = [{x: 250, y: 250, dx: -10, dy: 0},{x: 300, y: 300, dx: 10, dy: 0}];
var enemySpeed = 10;
var enemyDx = enemySpeed;
var enemyDy = enemySpeed;

var IDLookupTable = ["T121","T102","T023","T145","T892","T401","T349","T763","T034"];
let randomColors = getRandomColors(colorLookupTable);

let food = {
	x: foodX,
	y: foodY,
	width: 10,
	height: 10,
	color: 'red',
	blocks: Math.floor(Math.random() * 100) + 50
	};

pauseButton.addEventListener('click', togglePause());
 
document.addEventListener("keydown", function(event) {
	if (event.code === "Space") {
	   togglePause();
	}
	});

// main game loop 
function gameLoop() { 
	ctx.clearRect(0, 0, canvas.width, canvas.height); 
	  
	// Draw environment
	//drawCanvas();
	//drawRandomBlocks();
	//drawObstacles();
	drawBrickWall();
	if (initialize) {
		generateObstacles();
		game = setInterval(gameLoop, speed);
		initialize=false;
	}
	
	// Planning
	listenKeys();
	//moveEnemies();
	// Draw Player
	//drawSnake(snake);
	//moveSnake(snake); 
	// Draw NPCs
	drawFood();
	//drawEnemies();
	moveRandomSnakes();
	
	for (i = 0; i < randomSnakes.length; i++) {
		drawSnake(randomSnakes[i]);
		moveSnakesRandomly(randomSnakes[i]);
		checkEatenFood(randomSnakes[i]);
	}
	
	// Game Logic
	checkEatenFood(snake);
	checkCollisionWithObstacles();
	gameOver();
	printScore()
} 

function moveSnakesRandomly(snakeObj) {
	// Check for wall collision
	if (snakeObj.body[0].x < 0) {
		snakeObj.body[0].x += snakeObj.size*2;
		snakeObj.dx = snakeObj.size;
		snakeObj.dy = 0;
		snakeObj.currentDirection = "right";
	} else if (snakeObj.body[0].x > canvas.width - snakeObj.size) {
		snakeObj.body[0].x -= snakeObj.size*2;
		snakeObj.dx = snakeObj.size;
		snakeObj.dy = 0;
		snakeObj.currentDirection = "right";
	} else if (snakeObj.body[0].y < 0) {
		snakeObj.body[0].y += snakeObj.size*2;
		snakeObj.dx = 0;
		snakeObj.dy = snakeObj.size;
		snakeObj.currentDirection = "right";
	} else if (snakeObj.body[0].y > canvas.height - snakeObj.size) {
		snakeObj.body[0].y -= snakeObj.size*2;
		snakeObj.dx = 0;
		snakeObj.dy = snakeObj.size;
		snakeObj.currentDirection = "right";
	}
	moveSnake(snakeObj);
}

// Function to generate random snakes
function generateRandomSnakes(numSnakes) {
	for (let i = 0; i < numSnakes; i++) {
		let newSnake = {
			body: [{x: (Math.floor(Math.random() * canvas.width / 10) * 10), y: (Math.floor(Math.random() * canvas.height / 10) * 10)}], 
			dx: 0, 
			dy: 10, 
			currentDirection: "down", 
			BlockFillStyle: '#'+Math.floor(Math.random()*16777215).toString(16), 
			BlockStrokeStyle: '#'+Math.floor(Math.random()*16777215).toString(16),
			score: 0,
			size: 10
			};
			
		var blocks = Math.floor(Math.random() * 5) + 1;
		
		for (j = 0; j < blocks + 1; j++) {
			newSnake.body.push({x: (Math.floor(Math.random() * canvas.width / 10) * 10), y: (Math.floor(Math.random() * canvas.height / 10) * 10)});
		}
			
		randomSnakes.push(newSnake);
	}
}

// Function to move the random snakes at random intervals
function moveRandomSnakes() {
	for (i = 0; i < randomSnakes.length; i++) {
		let rand = Math.random();
		// Randomly change direction and move snake at random intervals
		if (rand < 0.25) {
		  randomSnakes[i].dx = -10;
		  randomSnakes[i].dy = 0;
		  randomSnakes[i].currentDirection = "left";
		} else if (rand < 0.5) {
		  randomSnakes[i].dx = 10;
		  randomSnakes[i].dy = 0;
		  randomSnakes[i].currentDirection = "right";
		} else if (rand < 0.75) {
		  randomSnakes[i].dx = 0;
		  randomSnakes[i].dy = -10;
		  randomSnakes[i].currentDirection = "up";
		} else {
		  randomSnakes[i].dx = 0;
		  randomSnakes[i].dy = 10;
		  randomSnakes[i].currentDirection = "down";
		}
	}
}

// function to create enemies
function createEnemies() {
	for (let i = 0; i < 5; i++) {
		enemies.push({
			x: Math.floor(Math.random() * canvas.width),
			y: Math.floor(Math.random() * canvas.height),
			width: 20,
			height: 20,
			color: 'red',
			dx: Math.floor(Math.random() * 2) - 1,
			dy: Math.floor(Math.random() * 2) - 1
			});
	}
}

// function for drawing the enemies on the canvas
function drawEnemies() {
	ctx.fillStyle = 'red';
	ctx.strokeStyle = 'darkred';
	
	for (let i = 0; i < enemies.length; i++) {
		ctx.fillRect(enemies[i].x, enemies[i].y, snake.size, snake.size);
		ctx.strokeRect(enemies[i].x, enemies[i].y, snake.size, snake.size);
	}
}

// function for moving the enemies
function moveEnemies() {
	for (let i = 0; i < enemies.length; i++) {
		// remove the last element of the enemy
		enemies[i].x += enemies[i].dx;
		enemies[i].y += enemies[i].dy;
		
		// check for collision with walls
		if (enemies[i].x < 0 || enemies[i].x > canvas.width - snake.size || enemies[i].y < 0 || enemies[i].y > canvas.height - snake.size) {
			enemies[i].dx = -enemies[i].dx;
			enemies[i].dy = -enemies[i].dy;
		}
	}
}

// function for generating random obstacles
function generateObstacles() {
	// loop through the canvas to create obstacles
	for (let i = 0; i < canvas.height; i += 100) {
		for (let j = 0; j < canvas.width; j += 100) {
			// create a new obstacle object
			randomColors = getRandomColors(colorLookupTable);
				  
			if (Math.floor(Math.random() * 4) === 0) {
				let obstacle = {
					id: IDLookupTable[Math.floor(Math.random() * IDLookupTable.length) + 1],
					x: j + 10,
					y: i + 10,
					width: 10,
					height: 10,
					color: ["#426cf5", "#42f5ef"]
					};
				
				// push the obstacle to the array
				obstacles.push(obstacle);
			}
		}
	}
	
	// return the array of obstacles
	return obstacles;
}
 
function drawObstacles() {
	// loop through the obstacles array
	for (let i = 0; i < obstacles.length; i++) {
		// set the fill style to a dark gray color
		ctx.fillStyle = obstacles[i].color[0];
		// set the line width to 2
		ctx.lineWidth = 2;
		// set the stroke style to a light gray color
		ctx.strokeStyle = obstacles[i].color[1];
		// draw the obstacle
		ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
		ctx.strokeRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
	}
}
 
// function to check collision with obstacles
function checkCollisionWithObstacles() {
	// loop through the obstacles array
	for (let i = 0; i < obstacles.length; i++) {
		if (snake.body[0].x === obstacles[i].x &&
			snake.body[0].y === obstacles[i].y
			) {
			// Teleport snake to another obstacle with the same id
			for (let j = 0; j < obstacles.length; j++) {
				if (obstacles[j].id === obstacles[i].id && j !== i) {
					snake.body[0].x = obstacles[j].x;
					snake.body[0].y = obstacles[j].y;
					break;
				}
			}
		}
	}
}
 
function getRandomColors(lookupTable) {
	var Pair = lookupTable[Math.floor(Math.random() * lookupTable.length)];
	
	return [Pair[0], Pair[1]];
}
 
function drawRandomBlocks() {
	ctx.lineWidth = 2;
	ctx.strokeStyle = getRandomColors(colorLookupTable); // dark brown color
	ctx.fillStyle = getRandomColors(colorLookupTable); // light brown color
	  
	// loop through rows and columns to draw bricks, leaving a 5 block space around the edge
	for (let i = 15; i < canvas.height - 15; i += 10) {
		for (let j = 15; j < canvas.width - 15; j += 10) {
			// randomly decide if to draw a block
			if (Math.random() < 0.3) {
				ctx.fillRect(j, i, 10, 10);
				ctx.strokeRect(j, i, 10, 10);
				
				// randomly decide if to draw another block next to it
				if (Math.random() < 0.3) {
					ctx.fillRect(j + 10, i, 10, 10);
					ctx.strokeRect(j + 10, i, 10, 10);
				}
				
				// randomly decide if to draw another block next to it
				if (Math.random() < 0.3) {
					ctx.fillRect(j, i + 10, 10, 10);
					ctx.strokeRect(j, i + 10, 10, 10);
				}
			}
		}
	}
}
 
function drawSnake(snakeObj) {
	for (let i = 0; i < snakeObj.body.length; i++) {
		ctx.fillStyle = snakeObj.BlockFillStyle;
		ctx.strokeStyle = snakeObj.BlockStrokeStyle;
		ctx.fillRect(snakeObj.body[i].x, snakeObj.body[i].y, snakeObj.size, snakeObj.size);
		ctx.strokeRect(snakeObj.body[i].x, snakeObj.body[i].y, snakeObj.size, snakeObj.size);
	}
}
 
// function for drawing the food on the canvas 
function drawFood() {
	ctx.fillStyle = 'magenta';
	ctx.strokeStyle = 'purple';
	ctx.fillRect(foodX, foodY, snake.size, snake.size);
	ctx.strokeRect(foodX, foodY, snake.size, snake.size);
	ctx.fillStyle = 'white';
	ctx.font = "11px Calibri";
	ctx.fillText(food.blocks, foodX + snake.size/3, foodY + snake.size/1.5);
}
 
function drawCanvas() {
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgb(222,184,135)";// dark brown color
	ctx.fillStyle = "rgb(139,69,19)"; // light brown color
	  
	// loop through rows and columns to draw bricks
	for (let i = 0; i < canvas.height; i += 10) {
		for (let j = 0; j < canvas.width; j += 10) {
			ctx.strokeRect(j, i, 10, 10);
			ctx.fillRect(j, i, 10, 10);
		}
	}
}

function drawBrickWall() {
	ctx.lineWidth = 2;
	// Set the stroke style to a brick color
	ctx.strokeStyle = "#00308F";
	// Set the fill style to a slightly lighter brick color
	ctx.fillStyle = "#33FFDD";

	// Draw the wall
	for (let i = 0; i < canvas.height; i += 10) {
		for (let j = 0; j < canvas.width; j += 10) {
			if (i < 10 || i > canvas.height - 20 || j < 10 || j > canvas.width - 20) {
				ctx.fillRect(j, i, 10, 10);
				ctx.strokeRect(j, i, 10, 10);
			}
		}
	}
}

// function for moving the snake 
function moveSnake(snakeObj) {
	// remove the last element of the snake 
	snakeObj.body.pop(); 
	// add a new element to the front of the snake 
	snakeObj.body.unshift({x: snakeObj.body[0].x + snakeObj.dx, y: snakeObj.body[0].y + snakeObj.dy}); 
} 
 
function generateFood() {
	let overlap = true;
		
	while (overlap) {
		foodX = Math.floor(Math.random() * (canvas.width / 10)) * 10;
		foodY = Math.floor(Math.random() * (canvas.height / 10)) * 10;
		overlap = false;
				
		for (let i = 1; i < snake.body.length; i++) {
			if (foodX === snake.body[i].x && foodY === snake.body[i].y) {
				overlap = true;
				break;
			}
		}
				
		for (let i = 1; i < obstacles.length; i++) {
			if (foodX === obstacles[i].x && foodY === obstacles[i].y) {
				overlap = true;
				break;
			}
		}
				
		if (foodX < 10 || foodX > canvas.width - 30 || foodY < 10 || foodY > canvas.height - 30) {
			overlap = true;
		}
	}
		
	food.blocks = Math.floor(Math.random() * 50) + 10; 
	startTime = Date.now();
}
 
function checkEatenFood(snakeObj) {
	// check if the snake has collided with the food 
	if (snakeObj.body[0].x === foodX && snakeObj.body[0].y === foodY) { 
		for(i=0; i<food.blocks; i++){
			snakeObj.body.push({});
		}
			 
		timeTaken = (Date.now() - startTime) / 1000;
		if (timeTaken < 0) {
			timeTaken = 0;
		}
			 
		generateFood(); 
		increaseSpeed();
		updateScore();
	}
}

function listenKeys() {
	// Listen for arrow key presses
	document.onkeydown = function(event) {
		switch(event.keyCode) {
			case 37: // Left arrow
				if (snake.currentDirection != "right") {
					// Update the direction of the snake
					snake.currentDirection = "left";
					snake.dx = -10; 
					snake.dy = 0; 
				}
				break;
			case 38: // Up arrow
				if (snake.currentDirection != "down") {
					// Update the direction of the snake
					snake.currentDirection = "up";
					snake.dx = 0; 
					snake.dy = -10; 
					}
				break;
			case 39: // Right arrow
				if (snake.currentDirection != "left") {
					// Update the direction of the snake
					snake.currentDirection = "right";
					snake.dx = 10; 
					snake.dy = 0; 
				}
				break;
			case 40: // Down arrow
				if (snake.currentDirection != "up") {
					// Update the direction of the snake
					snake.currentDirection = "down";
					snake.dx = 0; 
					snake.dy = 10; 
				}
				break;
		}
	};
}

// Scoring system
function updateScore() {
	snake.score +=  Math.floor((((snake.size + food.blocks) * speed) / 100) - (timeTaken * 0.5));
}
 
function printScore() {
	scoreBox.innerHTML = "Score: " + snake.score + "<br>" + "Speed: " + (100 - speed);
}
 
// function to increase snake's speed when it eats food
function increaseSpeed() {
	if (speed > 1) {
		clearInterval(game);
		speed -= 1;
		game = setInterval(gameLoop, speed);
	}
}

// function for checking if game is over
function gameOver() {
	for (let i = 1; i < snake.body.length; i++) {
		if (snake.body[0].x === snake.body[i].x && snake.body[0].y === snake.body[i].y) {
			clearInterval(gameLoop);
			alert("Game Over!");
			restartGame();
		}

		// Check for wall collision
		if (snake.body[0].x < 0 || 
			snake.body[0].x > canvas.width - snake.size || 
			snake.body[0].y < 0 || 
			snake.body[0].y > canvas.height - snake.size
			) {
			clearInterval(gameLoop);
			alert("Game Over!");
			restartGame();
		}
	}
}

function restartGame() {
	snake = {
		body: [{x: 150, y: 150},{x: 150, y: 140}], 
		dx: 0, 
		dy: 10, 
		currentDirection: "down", 
		BlockFillStyle: 'lightgreen', 
		BlockStrokeStyle: 'darkgreen',
		score: 0,
		size: 10
		};

	speed = 100;
	document.getElementById("score").innerHTML = "Score: " + snake.score;
	document.getElementById("speed").innerHTML = "Speed: " + speed;
	game = setInterval(gameLoop, speed);
}

// Create the togglePause function
function togglePause() {
	if (game) {
		// If the game is running, clear the interval
		clearInterval(game);
		game = null;
		pauseButton.innerHTML = "Resume";
	} else {
		// If the game is paused, start the interval again
		game = setInterval(gameLoop, speed);
		pauseButton.innerHTML = "Pause";
	}
}

generateRandomSnakes(3);
createEnemies();
generateFood(); 
gameLoop();