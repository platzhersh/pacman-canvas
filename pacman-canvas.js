/* -----------------------------------------------------------------

	___________    ____   _____ _____    ____  
	\____ \__  \ _/ ___\ /     \\__  \  /    \ 
	|  |_> > __ \\  \___|  Y Y  \/ __ \|   |  \
	|   __(____  /\___  >__|_|  (____  /___|  /
	|__|       \/     \/      \/     \/     \/ .platzh1rsch.ch
	
	author: platzh1rsch		(www.platzh1rsch.ch)
	
-------------------------------------------------------------------*/


/* ----- Global Variables ---------------------------------------- */
	var canvas;
	var context;
	var game;
	var inky, blinky, clyde, pinky;
	
	var mapConfig = 'data/map.json';
	
	function buildWall(context,gridX,gridY,width,height) {
		width = width*2-1;
		height = height*2-1;
		context.fillRect(pacman.radius/2+gridX*2*pacman.radius,pacman.radius/2+gridY*2*pacman.radius, width*pacman.radius, height*pacman.radius);
	}
	
	function between (x, min, max) {
		return x >= min && x <= max;
		}
	
	// Manages the whole game ("God Object")
	function Game() {
		this.running = true;
		this.pause = false;
		this.score = new Score();
		this.soundfx = 0;
		this.map;
		this.pillCount;	// # of pills
		this.monsters;
		this.canvas = $("#myCanvas").get(0);
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.toggleSound = function() { 
			this.soundfx == 0 ? this.soundfx = 1 : this.soundfx = 0; 
			$('#mute').toggle();
			}
		this.reset = function() {
			}
		this.init = function (context) {
			// get Level Map
			$.ajax({
				url: mapConfig,
				async: false,
				 beforeSend: function(xhr){
					if (xhr.overrideMimeType) xhr.overrideMimeType("application/json"); 
				},
				dataType: "json",
				success: function (data) {
					game.map =  data;
				}
			});
		
			var temp = 0;
			$.each(this.map.posY, function(i, item) {
			   $.each(this.posX, function() { 
				   if (this.type == "pill") {
					temp++;
					//console.log("Pill Count++. temp="+temp+". PillCount="+this.pillCount+".");
					}
				});
			});
			
			this.pillCount = temp;
			$(".lives").html("Lives: "+pacman.lives);	
			/*var text = "Insert Coin to Play!";
			context.fillStyle = "#FFF";
			context.font = "20px 'Press Start 2P'";
			context.fillText(text, this.canvas.width/2-200, this.canvas.height/2-10);
			*/
			
			this.score.set(0);
			this.score.refresh(".score");
			pacman.lives = 3;
			
					// initalize Ghosts
			pinky = new Ghost(14*pacman.radius,10*pacman.radius,'img/pinky.svg');
			inky = new Ghost(16*pacman.radius,10*pacman.radius,'img/inky.svg');
			blinky = new Ghost(18*pacman.radius,10*pacman.radius,'img/blinky.svg');
			clyde = new Ghost(20*pacman.radius,10*pacman.radius,'img/clyde.svg');
		
			}
		this.check = function() {
		if ((game.pillCount == 0) && game.running) {
				alert("You made it!\nFinal Score: "+game.score.score);
				game.running = false;
			}
		}
		this.win = function () {}
		this.gameover = function () {}
		this.toPixelPos = function (gridPos) {
			return gridPos*30;
		}
		this.toGridPos = function (pixelPos) {
			return ((pixelPos % 30)/30);
		}
	}

	game = new Game();
	
	function Score() {
		this.score = 0;
		this.set = function(i) {
			this.score = i;
		}
		this.add = function(i) {
			this.score += i;
		}
		this.refresh = function(h) {
			$(h).html("Score: "+this.score);
		}
		
	}
	
	
	
	// used to play sounds during the game
	var Sound = new Object();
	Sound.play = function (sound) {
		if (game.soundfx == 1) {
			var audio = document.getElementById(sound);
			(audio != null) ? audio.play() : console.log(sound+" not found");
			}
	}
	
	
	// Direction object in Constructor notation
	function Direction(name,angle1,angle2,dirX,dirY) {
		this.name = name;
		this.angle1 = angle1;
		this.angle2 = angle2;
		this.dirX = dirX;
		this.dirY = dirY;
	}
	
	// Direction Objects
	var up = new Direction("up",1.75,1.25,0,-1);		// UP
	var left = new Direction("left",1.25,0.75,-1,0);	// LEFT
	var down = new Direction("down",0.75,0.25,0,1);		// DOWN
	var right = new Direction("right",0.25,1.75,1,0);	// RIGHT
	
	
	// DirectionWatcher
	function directionWatcher() {
		this.dir = null;
		this.set = function(dir) {
			this.dir = dir;
			
		}
		this.get = function() {
			return this.dir;
		}
		}
		
	//var directionWatcher = new directionWatcher();
	
	// Ghost object in Constructor notation
	function Ghost(posX, posY, image) {
		this.posX = posX;
		this.posY = posY;
		this.image = new Image();
		this.image.src = image;
		this.dazzle = false;
		this.dazzleImg = new Image();
		this.dazzleImg.src = 'img/dazzled.svg';
		this.direction = right;
		this.radius = pacman.radius;
		this.draw = function (context) {					
		if (this.dazzle)	context.drawImage(this.dazzleImg, this.posX, this.posY, 2*this.radius, 2*this.radius);
		else context.drawImage(this.image, this.posX, this.posY, 2*this.radius, 2*this.radius);
		}
		this.getCenterX = function () {
			return this.posX+this.radius;
		}
		this.getCenterY = function () {
			return this.posY+this.radius;
		}
		
		this.die = function() {
			this.posX = 14*pacman.radius;
			this.posY = 10*pacman.radius;
		}
	
		this.checkCollision = function() {
			if ((this.posX % (2*this.radius) === 0) && (this.posY % (2*this.radius) === 0)) {
				if ((Math.floor((Math.random()*10)+1)%6) == 3) this.setRandomDirection();
				}
			
			// Get the Grid Position of Pac
			var gridAheadX = this.getGridPosX();
			var gridAheadY = this.getGridPosY();
			
			// get the field 1 ahead to check wall collisions
			if ((this.dirX == 1) && (gridAheadX < 17)) gridAheadX += 1;
			if ((this.dirY == 1) && (gridAheadY < 12)) gridAheadY += 1;
			var fieldAhead = game.map.posY[gridAheadY].posX[gridAheadX];
			
			
			/*	Check Wall Collision			*/
			if (fieldAhead.type === "wall") {
				this.stuckX = this.dirX;
				this.stuckY = this.dirY;
				this.stop=true;
				// get out of the wall
				if ((this.stuckX == 1) && ((this.posX % 2*this.radius) != 0)) this.posX -= 5;
				if ((this.stuckY == 1) && ((this.posY % 2*this.radius) != 0)) this.posY -= 5;
				if (this.stuckX == -1) this.posX += 5;
				if (this.stuckY == -1) this.posY += 5;
				this.setRandomDirection();
				this.stop=false;
			}
			/* Check Ghost / Pacman Collision			*/
			if ((between(pacman.getCenterX(), this.getCenterX()-10, this.getCenterX()+10)) 
				&& (between(pacman.getCenterY(), this.getCenterY()-10, this.getCenterY()+10)))
			{
				if (pacman.beastMode == false) {
					pacman.die();
					}
				else {
					this.die();
					game.score.add(100);
					}
			}
			
		}
		this.setRandomDirection = function() {
			 var dir = Math.floor((Math.random()*10)+1)%5; 

			 switch(dir) {
				case 1:	
					this.setDirection(up);
					break;
				case 2:	
					this.setDirection(down);
					break;
				case 3: 	
					this.setDirection(right);
					break;
				case 4:		
					this.setDirection(left);
					break;
				default: 	
					this.setDirection(right);
					break;
			 }
		}
		
	}
	
	Ghost.prototype = new Figure();
	
	
	// Super Class for Pacman & Ghosts
	function Figure() {
		this.posX;
		this.posY;
		this.dirX = right.dirX;
		this.dirY = right.dirY;
		this.direction;
		this.stop = true;
		this.directionWatcher = new directionWatcher();
		this.checkDirectionChange = function() {}
		this.move = function() {
		
			if (!this.stop) {
				this.posX += 5 * this.dirX;
				this.posY += 5 * this.dirY;
				
				// Check if out of canvas
				if (this.posX >= game.width-this.radius) this.posX = 5-this.radius;
				if (this.posX <= 0-this.radius) this.posX = game.width-5-this.radius;
				if (this.posY >= game.height-this.radius) this.posY = 5-this.radius;
				if (this.posY <= 0-this.radius) this.posY = game.height-5-this.radius;
				}
			}
		this.stop = function() { this.stop = true;}
		this.start = function() { this.stop = false;}
		
		this.getGridPosX = function() {
			return (this.posX - (this.posX % 30))/30;
		}
		this.getGridPosY = function() {
			return (this.posY - (this.posY % 30))/30;
		}
		this.setDirection = function(dir) {			
			this.dirX = dir.dirX;
			this.dirY = dir.dirY;
			this.angle1 = dir.angle1;
			this.angle2 = dir.angle2;
			this.direction = dir;
		}
	}
	
	function pacman() {
		this.radius = 15;
		this.posX = 0;
		this.posY = 6*2*this.radius;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
		this.mouth = 1; /* Switches between 1 and -1, depending on mouth closing / opening */
		this.dirX = right.dirX;
		this.dirY = right.dirY;
		this.lives = 3;
		this.stuckX = 0;
		this.stuckY = 0;
		this.getCenterX = function () {
			return this.posX+this.radius;
		}
		this.getCenterY = function () {
			return this.posY+this.radius;
		}
		this.directionWatcher = new directionWatcher();
		
		this.direction = right;
		
		this.beastMode = false;
		this.beastModeTimer = 0;
		
		this.checkCollisions = function () {
			
			if ((this.stuckX == 0) && (this.stuckY == 0)) {				
				
				// Get the Grid Position of Pac
				var gridX = this.getGridPosX();
				var gridY = this.getGridPosY();
				var gridAheadX = gridX;
				var gridAheadY = gridY;
				
				var field = game.map.posY[gridY].posX[gridX];

				// get the field 1 ahead to check wall collisions
				if ((this.dirX == 1) && (gridAheadX < 17)) gridAheadX += 1;
				if ((this.dirY == 1) && (gridAheadY < 12)) gridAheadY += 1;
				var fieldAhead = game.map.posY[gridAheadY].posX[gridAheadX];

				
				/*	Check Pill Collision			*/
				if ((field.type === "pill") || (field.type === "powerpill")) {
					//console.log("Pill found at ("+gridX+"/"+gridY+"). Pacman at ("+this.posX+"/"+this.posY+")");
					if (
						((this.dirX == 1) && (between(this.posX, game.toPixelPos(gridX)+this.radius-5, game.toPixelPos(gridX+1))))
						|| ((this.dirX == -1) && (between(this.posX, game.toPixelPos(gridX), game.toPixelPos(gridX)+5)))
						|| ((this.dirY == 1) && (between(this.posY, game.toPixelPos(gridY)+this.radius-5, game.toPixelPos(gridY+1))))
						|| ((this.dirY == -1) && (between(this.posY, game.toPixelPos(gridY), game.toPixelPos(gridY)+5)))
						|| (fieldAhead.type === "wall")
						)
						{	var s;
							if (field.type === "powerpill") {
								Sound.play("powerpill");
								s = 50;
								this.enableBeastMode();
								}
							else {
								Sound.play("waka");
								s = 10;
								game.pillCount--;
								}
							game.map.posY[gridY].posX[gridX].type = "null";
							game.score.add(s);
						}
				}
				
				/*	Check Wall Collision			*/
				if (fieldAhead.type === "wall") {
					this.stuckX = this.dirX;
					this.stuckY = this.dirY;
					pacman.stop();
					// get out of the wall
					if ((this.stuckX == 1) && ((this.posX % 2*this.radius) != 0)) this.posX -= 5;
					if ((this.stuckY == 1) && ((this.posY % 2*this.radius) != 0)) this.posY -= 5;
					if (this.stuckX == -1) this.posX += 5;
					if (this.stuckY == -1) this.posY += 5;
				}
				
			}
		}
		this.checkDirectionChange = function() {
			if (this.directionWatcher.get() != null) {
				//console.log("next Direction: "+directionWatcher.get().name);

				if ((this.stuckX == 1) && this.directionWatcher.get() == right) this.directionWatcher.set(null);
				else if ((this.stuckY == 1) && this.directionWatcher.get() == down) this.directionWatcher.set(null);
				else {
					// reset stuck events
					this.stuckX = 0;
					this.stuckY = 0;
					

					// only allow direction changes inside the grid
					if ((this.posX % (2*this.radius) === 0) && (this.posY % (2*this.radius) === 0)) {
					//console.log("changeDirection to "+directionWatcher.get().name);
					this.setDirection(this.directionWatcher.get());
					this.directionWatcher.set(null);
					}
				}
			}
		}
		this.setDirection = function(dir) {			
			this.dirX = dir.dirX;
			this.dirY = dir.dirY;
			this.angle1 = dir.angle1;
			this.angle2 = dir.angle2;
			this.direction = dir;
		}
		this.enableBeastMode = function() {
			this.beastMode = true;
			this.beastModeTimer = 240;
			console.log("Beast Mode activated!");
			inky.dazzle = true;
			pinky.dazzle = true;
			blinky.dazzle = true;
			clyde.dazzle = true;
		};
		this.disableBeastMode = function() { 
			this.beastMode = false; 
			console.log("Beast Mode is over!");
			inky.dazzle = false;
			pinky.dazzle = false;
			blinky.dazzle = false;
			clyde.dazzle = false;
			};
		this.move = function() {
		
			if (this.beastModeTimer > 0) {
				this.beastModeTimer--;
				//console.log("Beast Mode: "+this.beastModeTimer);
				}
			if ((this.beastModeTimer == 0) && (this.beastMode == true)) this.disableBeastMode();
			
			this.posX += 5 * this.dirX;
			this.posY += 5 * this.dirY;
			
			// Check if out of canvas
			if (this.posX >= game.width-this.radius) this.posX = 5-this.radius;
			if (this.posX <= 0-this.radius) this.posX = game.width-5-this.radius;
			if (this.posY >= game.height-this.radius) this.posY = 5-this.radius;
			if (this.posY <= 0-this.radius) this.posY = game.height-5-this.radius;
			}
		
		this.eat = function () {
		
			this.angle1 -= this.mouth*0.07;
			this.angle2 += this.mouth*0.07;
			
			var limitMax1 = this.direction.angle1;
			var limitMax2 = this.direction.angle2;
			var limitMin1 = this.direction.angle1 - 0.21;
			var limitMin2 = this.direction.angle2 + 0.21;
				
			if (this.angle1 < limitMin1 || this.angle2 > limitMin2)
			{
				this.mouth = -1;
			}
			if (this.angle1 >= limitMax1 || this.angle2 <= limitMax2)
			{
				this.mouth = 1;
			}
		
		}
		
		this.stop = function() {
			this.dirX = 0;
			this.dirY = 0;
		}
		
		this.die = function() {
			this.stop();
			this.posX = 0;
			this.posY = 6*2*this.radius;
			this.lives--;
			if (this.lives == 0) {
				alert("Game over!\nTotal Score: "+game.score.score);
				game.init();
				}
			$(".lives").html("Lives: "+this.lives);	
			Sound.play("die");
			}
		this.reset = function() {
			this.dirX = 1;
			this.dirY = 0;
			}
		this.getGridPosX = function() {
			return (this.posX - (this.posX % 30))/30;
		}
		this.getGridPosY = function() {
			return (this.posY - (this.posY % 30))/30;
		}
	}
		var pacman = new pacman();
	
// Check if a new cache is available on page load.	 
function checkAppCache() {
window.addEventListener('load', function(e) 
{
	window.applicationCache.addEventListener('updateready', function(e) 
	{
		if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {

			// Browser downloaded a new app cache.
			// Swap it in and reload the page to get the new hotness.
			window.applicationCache.swapCache();
			if (confirm('A new version of this site is available. Load it?')) {
				window.location.reload();
			}

		} else {
		// Manifest didn't changed. Nothing new to server.
		}

	}, false);

	 

}, false);

}
	
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
		
		checkAppCache();
		
		canvas = $("#myCanvas").get(0);
		context = canvas.getContext("2d");
        
            
 
		/* --------------- GAME INITIALISATION ------------------------------------
		
			TODO: put this into Game object and change code to accept different setups / levels
		
		-------------------------------------------------------------------------- */
		
		game.init();
		
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
			
			// cage
			buildWall(context,7,4,1,1);
			buildWall(context,6,5,1,2);
			buildWall(context,10,4,1,1);
			buildWall(context,11,5,1,2);
			buildWall(context,6,6,6,1);
			
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

