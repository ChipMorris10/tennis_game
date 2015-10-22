// create main variables used
var canvas;


var canvasContext;

// draw all the images
var ballX = 50;
var ballY = 50;

// handle ball speed
var ballSpeedX = 10;
var ballSpeedY = 4;

// scorekeeping
var player1Score = 0;
var player2Score = 0;
const winningScore = 3;

// show winning screen
var showingWinScreen = false;

// handles the paddle's height and thickness
var paddle1Y = 250;
var paddle2Y = 250;
const paddleThickness = 10;
const paddleHeight = 100;


// handles mouse position for left paddle
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
      x:mouseX,
      y:mouseY
  };
}


// click to start a new game
function handleMouseClick(evt) {
  if(showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}


window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');


  // allows the ball to move
  var framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener ('mousemove', function(evt) {
      var mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y - (paddleHeight/2);
  });


canvas.addEventListener('mousedown', handleMouseClick);
};


// reset on win to center of the screen
function ballReset() {
  if(player1Score >= winningScore ||
     player2Score >= winningScore) {
        showingWinScreen = true;
  }

  // control ball speed
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

// control computer's paddle
function computerMovement() {
  var paddle2YCenter = paddle2Y + (paddleHeight/2);
  if(paddle2YCenter < ballY-35) {
    paddle2Y += 6;
  } else if(paddle2YCenter > ballY+35) {
    paddle2Y -= 6;
  }
}


// allow all movements to get calculated at one time
function moveEverything() {
  if(showingWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // check if ball misses paddle on right side, reset ball to center
  if (ballX > canvas.width) {
    if(ballY > paddle2Y &&
      ballY < paddle2Y+paddleHeight) {
        ballSpeedX = -ballSpeedX;

        var deltaY = ballY
          -(paddle2Y+paddleHeight/2);
          ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  }


  // check if ball misses paddle on left side, reset ball to center
  if(ballX < 0)  {
    if(ballY > paddle1Y &&
      ballY < paddle1Y+paddleHeight) {
        ballSpeedX = -ballSpeedX;

        var deltaY = ballY
          -(paddle1Y+paddleHeight/2);
          ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++;
      ballReset();
    }
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  if(ballY < 0) {
   ballSpeedY = -ballSpeedY;
  }
}

// draws net down middle of screen
function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width/2-1, i, 2, 20, 'yellow');
  }
}


// use to draw everything that's needed for the game
function drawEverything() {
 // next line blanks out the screen with black
 colorRect(0,0,canvas.width, canvas.height, 'black');

 if (showingWinScreen) {
   canvasContext.fillStyle = 'yellow';

   if (player1Score >= WINNING_SCORE) {
     canvasContext.fillText('Left Player won!',350,200);
   } else if (player2Score >= WINNING_SCORE) {
     canvasContext.fillText('Right Player won!',350,200);
   }
   canvasContext.fillText('click to continue', 350, 500);
   return;
 }

 drawNet();


  // left player paddle
  colorRect(0, paddle1Y, paddleThickness, paddleHeight, 'yellow');

   // right player paddle
  colorRect(canvas.width - paddleThickness, paddle2Y, paddleThickness, paddleHeight, 'yellow');

  // draws the ball
  colorCircle(ballX, ballY, 10, "white");

  // display player's scores
  canvasContext.fillText("score stuff", 100, 100 )
  canvasContext.fillText(Player1Score, 100, 100);
  canvasContext.fillText(Player2Score, canvas.width-100,100);
}

// handles the ball size and color
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}


function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;

  // coresponds to the top left, right, and the width and height variables at id='game canvas'
  canvasContext.fillRect(leftX, topY, width, height);
}
