/**
 * This work may distributed in any manner for non-commercial purposes
 * Date: 2015.06.05
 * Version: 1.0
 * Author: Irina Lavryonova
 */

//Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width    = 500;
canvas.height   = 720;
document.body.appendChild(canvas);



//Variables common to multiple objects/variables which need to be referenced in the objects
var paddleWidth = canvas.width / 50;
var paddleHeight = canvas.height / 7;

var edgeBarWidth = canvas.width;
var edgeBarHeight = canvas.height / 45;

var topLim = canvas.height / 15 + edgeBarHeight;
var bottomLim = canvas.height - canvas.height / 15 - edgeBarHeight;

var ballSideDim = canvas.width / 70;
var ballXModifier = 0;
var ballYModifier = 0;




//Handles start of the game
var ready = false;


//Handles aiming
var leftUp = false;
var leftDown = false;
var rightUp = false;
var rightDown = false;

//Handles bounce off the paddles
var ballTouchLeftPad = false;
var ballTouchRightPad = false;

//Maximum amt of points a side can score
var maxScore = 10;



/*FOR ANOTHER VERSION: make the ball bounce on the top of the paddles and the bottom*/
/*var ballTouchTBPad = false;*/




/*FOR TESTING*/
/*var rightDiv = 0;
var rightMult = 0;
var leftDiv = 0;
var leftMult = 0;*/
/*FOR TESTING*/


//Game objects
var leftPaddle = {
    speed: 256 * 1.0, //movement in pixels per second
    x: canvas.width / 25,
    y: canvas.height / 2 - paddleHeight / 2
};
var rightPaddle = {
    speed: 256 * 1.0, //movement in pixels per second,
    x: canvas.width - canvas.width / 25 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2
};
var ball = {
    speed: 0, //movement in pixels per second, set in update b/c varies on modifier
    x: canvas.width / 2 - ballSideDim / 2,
    y: canvas.height / 2 - ballSideDim / 2
};


//Field elements
var topBar = {
    width: edgeBarWidth,
    height: edgeBarHeight,
    x: 0,
    y: canvas.height / 15
};
var bottomBar = {
    width: edgeBarWidth,
    height: edgeBarHeight,
    x: 0,
    y: canvas.height - canvas.height / 15 - edgeBarHeight
};
var scores = {
    left: 0,
    right: 0
};



//Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);



/**
 * Resets game to default vals
 * ball is in the middle of field, paddles are in the middle of their tracks
 */
var reset = function () {
    //Default positions of elements
    leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
    rightPaddle.y = canvas.height / 2 - paddleHeight / 2;
    ball.x = canvas.width / 2 - ballSideDim / 2;
    ball.y = canvas.height / 2 - ballSideDim / 2;
    
    
    //Make ball move in a random direction
    var posNegX = Math.random();
    var posNegY = Math.random();
    
    if (posNegX <= 0.49 && posNegY <= 0.49) {
        ballXModifier = -(Math.random() * 0.5);
        ballYModifier = -(Math.random() * 0.5);
    } else if (posNegX > 0.49 && posNegY <= 0.49) {
        ballXModifier = (Math.random() * 0.5);
        ballYModifier = -(Math.random() * 0.5);
    } else if (posNegX <= 0.49 && posNegY > 0.49) {
        ballXModifier = -(Math.random() * 0.5);
        ballYModifier = (Math.random() * 0.5);
    } else {
        ballXModifier = (Math.random() * 0.5);
        ballYModifier = (Math.random() * 0.5);
    }
};


/**
 * Handles input by user
 * Updates the vals of moving objects according to user input
 * 
 * @param modifier update time in secs. Gets multiplied with the speed of the object to make sure that the object moves at the same speed no matter how much lag there is
 */
var update = function (modifier) {
    //rightpaddle up
    if (38 in keysDown) { //Player holding up
        //Make paddle unable to move beyond the limiters
        if (rightPaddle.y - rightPaddle.speed * modifier > topLim) {
            rightPaddle.y -= rightPaddle.speed * modifier;
        }
        rightUp = true;
    } else {
        rightUp = false;
    }
    
    //rightpaddle down
    if (40 in keysDown) { //Player holding down
        //Make paddle unable to move beyond the limiters
        if (rightPaddle.y + paddleHeight + rightPaddle.speed * modifier < bottomLim) {
            rightPaddle.y += rightPaddle.speed * modifier;
        }
        rightDown = true;
        
    } else {
        rightDown = false;
    }
    
    //leftpaddle up
    if (87 in keysDown) { //Player holding w
        //Make paddle unable to move beyond the limiters
        if (leftPaddle.y - leftPaddle.speed * modifier > topLim) {
            leftPaddle.y -= leftPaddle.speed * modifier;
        }
        leftUp = true;
    } else {
        leftUp = false;
    }
    
    //leftpaddle down
    if (83 in keysDown) { //Player holding s
        //Make paddle unable to move beyond the limiters
        if (leftPaddle.y + paddleHeight + leftPaddle.speed * modifier < bottomLim) {
            leftPaddle.y += leftPaddle.speed * modifier;
        }
        leftDown = true;
    } else {
        leftDown = false;
    }
    //reset the ball and paddles if needed (such as if the ball in moving in a boring direction)
    if (72 in keysDown) { //player pressed h
        reset();
    }
    
    //handle when the player is ready
    if (32 in keysDown) { //Player pressed space
        ready = true;
    }
    
    //make it so that the paddles are borders, therefore so that the ball bounces off them
    if ((ball.x + ball.speed * ballXModifier * modifier + ballSideDim > rightPaddle.x
                && ball.x + ball.speed * ballXModifier * modifier < rightPaddle.x)
            && (ball.y + ballSideDim + ball.speed * ballYModifier * modifier < rightPaddle.y + paddleHeight
                && ball.y + ball.speed * ballYModifier * modifier > rightPaddle.y)) {
        ballTouchRightPad = true;
    } else {
        ballTouchRightPad = false;
    }
    if ((ball.x + ball.speed * ballXModifier * modifier < leftPaddle.x + paddleWidth
                &&  ball.x + ball.speed * ballXModifier * modifier + ballSideDim > leftPaddle.x + paddleWidth)
            && (ball.y + ballSideDim + ball.speed * ballYModifier * modifier < leftPaddle.y + paddleHeight
                && ball.y + ball.speed * ballYModifier * modifier > leftPaddle.y)) {
        ballTouchLeftPad = true;
    } else {
        ballTouchLeftPad = false;
    }
    
    /*FOR ANOTHER VERSION: make ball bounce on the top of the paddle*/
    /*if( ( (ball.x + ball.speed * ballXModifier * modifier >= rightPaddle.x && ball.x + ball.speed * ballXModifier * modifier + ballSideDim <= rightPaddle.x + paddleWidth)
            || (ball.x + ball.speed * ballXModifier * modifier >= leftPaddle.x && ball.x + ball.speed * ballXModifier * modifier + ballSideDim <= leftPaddle.x + paddleWidth) )
    && (ball.y + ball.speed * ballYModifier * modifier <=  leftPaddle.y + leftPaddle.speed * modifier + paddleHeight 
           || ball.y + ball.speed * ballYModifier * modifier <=  rightPaddle.y + rightPaddle.speed * modifier + paddleHeight 
           || ball.y + ball.speed * ballYModifier * modifier + ballSideDim >= leftPaddle.y + leftPaddle.speed * modifier 
           || ball.y + ball.speed * ballYModifier * modifier + ballSideDim >= rightPaddle.y + rightPaddle.speed * modifier) ){
        ballTouchTBPad = true;
    } else {
        ballTouchTBPad = false;
    }*/
    
    //make ball move only within the boundaries and handle scoring and reseting
    if (ready) {
        //change direction if the ball has hit the top or bottom boundaries
        if (ball.y + ball.speed * ballYModifier * modifier < topLim || ball.y + ball.speed * ballYModifier * modifier + ballSideDim > bottomLim) {
            ballYModifier *= -1;
        //change direction if the ball has hit one of the paddles
        } else if (ballTouchLeftPad || ballTouchRightPad /*|| ballTouchTBPad*/) {
            //Make it so that the ball bounces differently a moving paddle than a stationary one            
            if (ballTouchRightPad) { // NOTE: write a then/now statement to keep this from loop to infinity
                if ((rightUp && ballYModifier < 0.0) || (rightDown && ballYModifier > 0.0)) {
                    ballXModifier *= -0.4;
                    /*rightMult++;*/
                } else if ((rightUp && ballYModifier > 0.0) || (rightDown && ballYModifier < 0.0)) {
                    ballXModifier /= -0.4;
                    /*rightDiv++;*/
                } else {
                    ballXModifier *= -1;
                }
        } else if (ballTouchLeftPad) {
            if ((leftUp && ballYModifier < 0.0) || (leftDown && ballYModifier > 0.0)) {
                ballXModifier *= -0.4;
                /*leftMult++;*/
            } else if ((leftUp  && ballYModifier > 0.0) || (leftDown && ballYModifier < 0.0)) {
                ballXModifier /= -0.4;
                /*leftDiv++;*/
            } else {
                ballXModifier *= -1;
            }
        }
        //left scored
        } else if (ball.x + ballSideDim + ball.speed * ballXModifier * modifier > canvas.width) {
            scores.left++;
            reset();
        //right scored    
        } else if (ball.x + ballSideDim + ball.speed * ballXModifier * modifier < 0) {
            scores.right++;
            reset();
        }
        
        //Update speed of the ball with the speed per pixel (update time), and the x and y modifiers
        ball.speed = Math.abs(256 * 1.0 / Math.sqrt(ballYModifier * ballYModifier + ballXModifier * ballXModifier)); // speed that is adjusted for the change in direction (pythag theorem)
        
        
        //update the position of the ball with the speed, the modifier (update time), and the x and y modifiers
        ball.x += (ball.speed * ballXModifier * modifier);
        ball.y += (ball.speed * ballYModifier * modifier);
    }
};


/**
 * Draws everything in the order that it is mentioned, so the field is drawn first, then everything is drawn on top of it in order of appearance/layering
 */
var render = function () {
    //Draw field
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    //Draw top border edge
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.fillRect(topBar.x, topBar.y, edgeBarWidth, edgeBarHeight);
    
    //Draw bottom border edge
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.fillRect(bottomBar.x, bottomBar.y, edgeBarWidth, edgeBarHeight);
    
    //Draw instructions
    //keys
    ctx.fillStyle = "rgb(0, 255, 20)";
    ctx.font = "20px Monospace";
    ctx.fillText("Keys:", 50, 80);
    //w
    ctx.fillStyle = "rgb(0, 255, 20)";
    ctx.font = "15px Monospace";
    ctx.fillText("W: up for left paddle", 50, 100);
    //s
    ctx.fillStyle = "rgb(0, 255, 20)";
    ctx.font = "15px Monospace";
    ctx.fillText("S: down for left paddle", 50, 115);
    //up
    ctx.fillStyle = "rgb(0, 255, 20)";
    ctx.font = "15px Monospace";
    ctx.fillText("↑: up for right paddle", 50, 130);
    //down
    ctx.fillStyle = "rgb(0, 255, 20)";
    ctx.font = "15px Monospace";
    ctx.fillText("↓: down for right paddle", 50, 145);
    //h
    ctx.fillStyle = "rgb(0, 255, 20)";
    ctx.font = "15px Monospace";
    ctx.fillText("H: reset the ball", 50, 160);
    //game ends after 10 goals have been scored
    ctx.fillStyle = "rgb(0, 255, 20)";
    ctx.font = "15px Monospace";
    ctx.fillText("Game ends after 10 goals have been scored by a side", 50, 180);
    //press space when ready
    ctx.fillStyle = "rgb(0, 255, 20)";
    ctx.font = "20px Monospace";
    ctx.fillText("Press space when ready", 50, 200);
    
    
    
    /****     TESTING     *****/
    /*//score
    ctx.fillStyle = "green";
    ctx.font = "12px Monospace";
    ctx.fillText("Ball X: " + ball.x + " Ball Y: " + ball.y, 50, 100);
    //score
    ctx.fillStyle = "green";
    ctx.font = "12px Monospace";
    ctx.textAlign = "bottom";
    ctx.textBaseline = "center";
    ctx.fillText("BarBottomLim: " + bottomLim + " BarTopLim: " + topLim, 50, 120);
    //score
    ctx.fillStyle = "green";
    ctx.font = "12px Monospace";
    ctx.fillText("Ball Mod X: " + ballXModifier + " Ball Mod Y: " + ballYModifier, 50, 140);
    //score
    ctx.fillStyle = "green";
    ctx.font = "12px Monospace";
    ctx.fillText("Ball Speed: " + ball.speed, 50, 160);
    //score
    ctx.fillStyle = "green";
    ctx.font = "12px Monospace";
    ctx.fillText("Left Paddle X: " + leftPaddle.x + " Left Paddle Y: " + leftPaddle.y, 50, 180);
    //score
    ctx.fillStyle = "green";
    ctx.font = "12px Monospace";
    ctx.textAlign = "bottom";
    ctx.textBaseline = "center";
    ctx.fillText("Right Paddle X: " + rightPaddle.x + " Right Paddle Y: " + rightPaddle.y, 50, 200);
    //score
    ctx.fillStyle = "green";
    ctx.font = "12px Monospace";
    ctx.fillText("Right is up: " + rightUp + " Right is down: " + rightDown, 50, 220);
    //score
    ctx.fillStyle = "green";
    ctx.font = "12px Monospace";
    ctx.fillText("Right touch: " + ballTouchRightPad + " Left touch: " + ballTouchLeftPad, 50, 260);
    //score
    ctx.fillStyle = "green";
    ctx.font = "12px Monospace";
    ctx.fillText("Left is up:" + leftUp + " Left is down:" + leftDown, 50, 240);
    //score
    ctx.fillStyle = "green";
    ctx.font = "12px Monospace";
    ctx.fillText("Right div: " + rightDiv + " Right mult: " + rightMult, 50, 260);
    //score
    ctx.fillStyle = "green";
    ctx.textBaseline = "center";
    ctx.fillText("Ready:" + ready, 50, 280);*/
    /****    TESTIGN     *****/
    /****    TESTIGN     *****/
    
    
    
    
    //Right bar
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);
    
    //Left bar
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
    
    //Ball
    ctx.fillRect(ball.x, ball.y, ballSideDim, ballSideDim);
    
    var text = "Score left: " + scores.left + " || " + "Score right: " + scores.right;
    
    //score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "15px Monospace";
    ctx.textAlign = "bottom";
    ctx.textBaseline = "center";
    ctx.fillText(text, canvas.width / 2 - text.length * 4, canvas.height / 30);
    
    
};

/**
 * Draws the game over sequence based on who won
 * The placing of the lettering should be fixed so that the middle of the text is on the middle of the field
 */
var gameOver = function () {
    
    ctx.fillStyle = "rgb(0, 255, 20)";
    ctx.font = "25px Monospace";
    ctx.textAlign = "bottom";
    ctx.textBaseline = "center";
    ctx.fillText("GAME OVER", canvas.width / 2 - 60, canvas.height / 2 + 40);
    
    //left won
    if (scores.left > scores.right) {
        ctx.fillStyle = "rgb(0, 255, 20)";
        ctx.font = "25px Monospace";
        ctx.textAlign = "bottom";
        ctx.textBaseline = "center";
        ctx.fillText("LEFT WON", canvas.width / 2 - 60, canvas.height / 2 + 60);
    //right won
    } else {
        ctx.fillStyle = "rgb(0, 255, 20)";
        ctx.font = "25px Monospace";
        ctx.textAlign = "bottom";
        ctx.textBaseline = "center";
        ctx.fillText("RIGHT WON", canvas.width / 2 - 60, canvas.height / 2 + 60);
    }
    
    ctx.fillStyle = "rgb(0, 255, 20)";
    ctx.font = "25px Monospace";
    ctx.textAlign = "bottom";
    ctx.textBaseline = "center";
    ctx.fillText("Press R to restart", canvas.width / 2 - 60, canvas.height / 2 + 80);
    
    if (82 in keysDown){
        reset();
        scores.left = 0;
        scores.right = 0;
    }
};

/**
 * Main function of the game where everything gets called
 */
var main = function () {
    //Keep track of when the game updates for dealing with lag
    var now = Date.now();
    var delta = now - then;
    
    
    if (scores.left < maxScore && scores.right < maxScore) {
        //update and draw the game elements
        update(delta / 1000);
        render();
    } else {
        //if someone has scored the max amount of points (maxScore), stop the game and show who had won
        gameOver();
    }
    
    then = now;
    
    //Request to do this again ASAP
    requestAnimationFrame(main);
};

//Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

//Keep track of when the game updates
var then = Date.now();

reset();
main();