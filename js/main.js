/* -----------------------------------------------------------------

	___________    ____   _____ _____    ____  
	\____ \__  \ _/ ___\ /     \\__  \  /    \ 
	|  |_> > __ \\  \___|  Y Y  \/ __ \|   |  \
	|   __(____  /\___  >__|_|  (____  /___|  /
	|__|       \/     \/      \/     \/     \/ .platzh1rsch.ch
	
	author: platzh1rsch		(www.platzh1rsch.ch)
	
-------------------------------------------------------------------*/


/*-------------------------------------------------------------------

	RequireJS
	
--------------------------------------------------------------------*/


// Start the main app logic.

requirejs.config({
    enforceDefine: true,
    paths: {
        jquery: 'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.1.min'
    }
});

define(['jquery','actors/util/direction', 'actors/util/directionWatcher','actors/Figure', 'actors/Pacman', 'actors/Ghost', 'game/Game', 'game/Score', 'game/Sound'],
function   ( $, Direction, directionWatcher, Figure, Pacman, Ghost, Game, Score, Sound) {

    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.

/*-------------------------------------------------------------------

	Start Game
	
--------------------------------------------------------------------*/

/* ----- Global Variables ---------------------------------------- */
var canvas;
var context;
var game;
var inky, blinky, clyde, pinky;
var pacman = new Pacman();

var mapConfig = 'data/map.json';

// Direction Objects
var up = new Direction("up",1.75,1.25,0,-1);		// UP
var left = new Direction("left",1.25,0.75,-1,0);	// LEFT
var down = new Direction("down",0.75,0.25,0,1);		// DOWN
var right = new Direction("right",0.25,1.75,1,0);	// RIGHT

function buildWall(context,gridX,gridY,width,height) {
	width = width*2-1;
	height = height*2-1;
	context.fillRect(pacman.radius/2+gridX*2*pacman.radius,pacman.radius/2+gridY*2*pacman.radius, width*pacman.radius, height*pacman.radius);
}

function between (x, min, max) {
	return x >= min && x <= max;
	}

game = new Game(mapConfig,pacman);
	

// Action starts here:

$(document).ready(function() {

	$.ajaxSetup({ mimeType: "application/json" });
	
	$.ajaxSetup({beforeSend: function(xhr){
		if (xhr.overrideMimeType){
			xhr.overrideMimeType("application/json");
			console.log("mimetype set to json");
			}
		}
	});
	
	// --------------- Controls
	
	// Keyboard
	window.addEventListener('keydown',doKeyDown,true);
	
	// Mobile Buttons
	$(document).on('touchend','.controlButton#up',function(event) {
		event.preventDefault();
		pacman.directionWatcher.set(up);
	});
	$(document).on('touchend','.controlButton#down',function(event) {
		event.preventDefault();
		pacman.directionWatcher.set(down);
	});
	$(document).on('touchend','.controlButton#left',function(event) {
		event.preventDefault();
		pacman.directionWatcher.set(left);
	});
	$(document).on('touchend','.controlButton#right',function(event) {
		event.preventDefault();
		pacman.directionWatcher.set(right);
	});
	
	canvas = $("#myCanvas").get(0);
	context = canvas.getContext("2d");
	
	/* --------------- GAME INITIALISATION ------------------------------------
	
		TODO: put this into Game object and change code to accept different setups / levels
	
	-------------------------------------------------------------------------- */
	
	game.init(0);
	
	animationLoop();
		
});


function renderContent()
{
	//context.save()
	
	// Refresh Score
	game.score.refresh(".score");
				
	// Pills
	context.beginPath();
	context.fillStyle = "White";
	context.strokeStyle = "White";
	
	var dotPosY;		
	$.each(game.map.posY, function(i, item) {
		dotPosY = this.row;
	   $.each(this.posX, function() { 
		   if (this.type == "pill") {
			context.arc(game.toPixelPos(this.col-1)+pacman.radius,game.toPixelPos(dotPosY-1)+pacman.radius,pacman.radius/5,0*Math.PI,2*Math.PI);
			context.moveTo(game.toPixelPos(this.col-1), game.toPixelPos(dotPosY-1));
		   }
		   else if (this.type == "powerpill") {
			context.arc(game.toPixelPos(this.col-1)+pacman.radius,game.toPixelPos(dotPosY-1)+pacman.radius,pacman.radius/3,0*Math.PI,2*Math.PI);
			context.moveTo(game.toPixelPos(this.col-1), game.toPixelPos(dotPosY-1));
		   }
	   }); 
	});
	context.fill();
	
	//context.beginPath();
	context.fillStyle = "Blue";
	context.strokeStyle = "Blue";
	
	//horizontal outer
	buildWall(context,0,0,18,1);
	buildWall(context,0,12,18,1);
	
	// vertical outer
	buildWall(context,0,0,1,6);
	buildWall(context,0,7,1,6);
	buildWall(context,17,0,1,6);
	buildWall(context,17,7,1,6);
	
	// ghost base
	buildWall(context,7,4,1,1);
	buildWall(context,6,5,1,2);
	buildWall(context,10,4,1,1);
	buildWall(context,11,5,1,2);
	buildWall(context,6,6,6,1);
	
	// ghost base door
	context.fillRect(8*2*pacman.radius,pacman.radius/2+4*2*pacman.radius+5, 4*pacman.radius, 1);
	
	// single blocks
	buildWall(context,4,0,1,2);
	buildWall(context,13,0,1,2);
	
	buildWall(context,2,2,1,2);
	buildWall(context,6,2,2,1);
	buildWall(context,15,2,1,2);
	buildWall(context,10,2,2,1);
	
	buildWall(context,2,3,2,1);
	buildWall(context,14,3,2,1);
	buildWall(context,5,3,1,1);
	buildWall(context,12,3,1,1);
	buildWall(context,3,3,1,3);
	buildWall(context,14,3,1,3);
	
	buildWall(context,3,4,1,1);
	buildWall(context,14,4,1,1);
	
	buildWall(context,0,5,2,1);
	buildWall(context,3,5,2,1);
	buildWall(context,16,5,2,1);
	buildWall(context,13,5,2,1);
	
	buildWall(context,0,7,2,2);
	buildWall(context,16,7,2,2);
	buildWall(context,3,7,2,2);
	buildWall(context,13,7,2,2);
	
	buildWall(context,4,8,2,2);
	buildWall(context,12,8,2,2);
	buildWall(context,5,8,3,1);
	buildWall(context,10,8,3,1);
	
	buildWall(context,2,10,1,1);
	buildWall(context,15,10,1,1);
	buildWall(context,7,10,4,1);
	buildWall(context,4,11,2,2);
	buildWall(context,12,11,2,2);
	/*context.moveTo(pacman.radius/2,pacman.radius/2);
	context.lineTo(pacman.radius + pacman.radius/2,pacman.radius/2);
	context.lineTo(pacman.radius + pacman.radius/2,pacman.radius + pacman.radius/2);
	context.lineTo(pacman.radius/2,pacman.radius + pacman.radius/2);
	context.closePath();*/
	//context.fill();
	
	// Ghosts
	pinky.draw(context);
	blinky.draw(context);
	inky.draw(context);
	clyde.draw(context);             
	
	
	// Pac Man
	context.beginPath();
	context.fillStyle = "Yellow";
	context.strokeStyle = "Yellow";
	context.arc(pacman.posX+pacman.radius,pacman.posY+pacman.radius,pacman.radius,pacman.angle1*Math.PI,pacman.angle2*Math.PI);
	context.lineTo(pacman.posX+pacman.radius, pacman.posY+pacman.radius);
	context.stroke();
	context.fill();
	
	//context.restore();
}

function renderGrid(gridPixelSize, color)
{
	context.save();
	context.lineWidth = 0.5;
	context.strokeStyle = color;
	
	// horizontal grid lines
	for(var i = 0; i <= canvas.height; i = i + gridPixelSize)
	{
		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(canvas.width, i);
		context.closePath();
		context.stroke();
	}
	
	// vertical grid lines
	for(var i = 0; i <= canvas.width; i = i + gridPixelSize)
	{
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, canvas.height);
		context.closePath();
		context.stroke();
	}
	
	context.restore();
}

function animationLoop()
{
	canvas.width = canvas.width;
	//renderGrid(pacman.radius, "red");
	renderContent();
	
	if (game.dieAnimation == 1) pacman.dieAnimation();
	if (game.pause != true){
		// Make changes before next loop
		pacman.move();
		pacman.eat();
		pacman.checkDirectionChange();
		pacman.checkCollisions();		// has to be the LAST method called on pacman

		inky.move();
		inky.checkCollision();
		pinky.move();			
		pinky.checkCollision();
		blinky.move();
		blinky.checkCollision();
		clyde.move();
		clyde.checkCollision();
	}
	
	// All dots collected?
	game.check();
	
	
	setTimeout(animationLoop, 33);
	
	
}



function doKeyDown(evt){

switch (evt.keyCode)
	{
	case 87:	// W pressed
		pacman.directionWatcher.set(up);
		break;
	case 83:	// S pressed 
		pacman.directionWatcher.set(down);
		break;
	case 65:	// A pressed
		pacman.directionWatcher.set(left);
		break;

	case 68:	// D pressed
		pacman.directionWatcher.set(right);
		break;
	}
}

/* end main */
});