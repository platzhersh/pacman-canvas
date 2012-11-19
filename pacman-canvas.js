/* -----------------------------------------------------------------

	___________    ____   _____ _____    ____  
	\____ \__  \ _/ ___\ /     \\__  \  /    \ 
	|  |_> > __ \\  \___|  Y Y  \/ __ \|   |  \
	|   __(____  /\___  >__|_|  (____  /___|  /
	|__|       \/     \/      \/     \/     \/ .platzh1rsch.ch
	
	author: platzh1rsch		(www.platzh1rsch.ch)
	
-------------------------------------------------------------------*/
	
	
	// Manages the whole game ("God Object")
	function Game() {
		this.running = true;
		this.pause = false;
		this.score = new Score();
		this.whiteDots;
		this.monsters;
		this.restart = function() {
			}
		this.initialize = function () {
			}
	}
	var game = new Game();
	
	function Score() {
		this.score = 0;
		this.add = function(i) {
			this.score += i;
		}
		this.refresh = function(h) {
			$(h).html("Score: "+this.score);
		}
		
	}
	var score = new Score();
	
	
	// used to play sounds during the game
	var Sound = new Object();
	Sound.play = function (sound) {
		var audio = document.getElementById(sound);
		(audio != null) ? audio.play() : console.log(sound+" not found");
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
		
	var directionWatcher = new directionWatcher();
	
	// Ghost object in Constructor notation
	function Ghost(posX, posY, image) {
		this.posX = posX;
		this.posY = posY;
		this.image = new Image();
		this.image.src = image;
		this.direction = right;
		this.radius = pacman.radius;
	}
	Ghost.prototype.draw = function (context) {					
		// Monster Draft
		context.drawImage(this.image, this.posX, this.posY, 2*this.radius, 2*this.radius);
	}
	
	
	// whiteDot object in Constructor notation
	function whiteDot(posX, posY) {
		this.posX = posX;
		this.posY = posY;
		this.radius = pacman.radius / 5;
		this.color = "White";
		
		// IMPORTANT: create new whiteDot instances with new whiteDot(..)
		whiteDotTable.add(this);
	}
	
	whiteDot.prototype.paint = function (context) {
		context.beginPath();
		context.fillStyle = "White";
		context.strokeStyle = "White";
		context.arc(this.posX,this.posY,this.radius,0*Math.PI,2*Math.PI);
		context.lineTo(this.PosX, this.PosY);
		context.stroke();
		context.fill();
	}
	
	// Monitors all the white Dots
	function whiteDotTable() {
		this.hash = new Object();
		this.add = function (whiteDot) {
			var key = whiteDot.posX.toString()+whiteDot.posY.toString();
			this.hash[key] = whiteDot;
		}
		this.getAll = function () {
			for (var k in this.hash) {
				console.log("key is: "+k + ", value is: "+this.hash[k]);
			}
		}
		this.get = function(key) {
			return this.hash[key] !== null ? this.hash[key] : false;
		}
		this.removeAll = function() {
			this.hash = new Object();
		}
		this.remove = function(key) {

			delete this.hash[key]
			//console.log("nom nom "+key);
			Sound.play("waka");
		}
		this.size = function () {
			var count = 0;
			for (var k in this.hash) {
				count++;
			}
			return count;
		}
		this.empty = function() {
			return (this.size() == 0);
		}
	}

	var whiteDotTable = new whiteDotTable();
	
	
	function pacman() {
		this.radius = 15;
		this.posX = 8*this.radius;
		this.posY = 0;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
		this.mouth = 1; /* Switches between 1 and -1, depending on mouth closing / opening */
		this.dirX = right.dirX;
		this.dirY = right.dirY;
		this.lives = 3;
		
		this.direction = right;
		
		this.checkCollisions = function () {
			var key = (this.posX+this.radius).toString()+(this.posY+this.radius).toString();
			var dot = whiteDotTable.get(key);
			if (dot != null) {
				//console.log("Collision at "+this.posX+","+this.posY+". (key: "+key+")");
				whiteDotTable.remove(key);
				score.add(10);
				}
			}
		this.checkDirectionChange = function() {
			if (directionWatcher.get() != null) {
				//console.log("next Direction: "+directionWatcher.get().name);
				if ((this.posX % (2*this.radius) === 0) && (this.posY % (2*this.radius) === 0)) {
				//console.log("changeDirection to "+directionWatcher.get().name);
				this.setDirection(directionWatcher.get());
				directionWatcher.set(null);
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

		this.move = function() {
			this.posX += 5 * this.dirX;
			this.posY += 5 * this.dirY;
			
			// Check if out of canvas
			if (this.posX >= 500-this.radius) this.posX = 5-this.radius;
			if (this.posX <= 0-this.radius) this.posX = 495-this.radius;
			if (this.posY >= 500-this.radius) this.posY = 5-this.radius;
			if (this.posY <= 0-this.radius) this.posY = 495-this.radius;
			
			this.eat();
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
			this.lives > 0 ? --this.lives : alert("Game over!");
			Sound.play("die");
			}
		this.reset = function() {
			this.dirX = 1;
			this.dirY = 0;
			}
	}
		var pacman = new pacman();
	
	
	// Action starts here:
	
	$(document).ready(function() {

		window.addEventListener('keydown',doKeyDown,true);

		var canvas = $("#myCanvas").get(0);
		var context = canvas.getContext("2d");
        
            
 
		/* --------------- GAME INITIALISATION ------------------------------------
		
			TODO: put this into Game object and change code to accept different setups / levels
		
		-------------------------------------------------------------------------- */
		// Whitedots vorbereiten
		for (var i = pacman.radius; i < canvas.width; i +=2*pacman.radius) {
			for (var j = pacman.radius; j < canvas.height; j+= 2*pacman.radius) {
			var dot = new whiteDot(i,j);
			}
		}
		
		// initalize Ghosts
		var pinky = new Ghost(0,0,'img/pinky.svg');
		var inky = new Ghost(2*pacman.radius,0,'img/inky.svg');
		var blinky = new Ghost(4*pacman.radius,0,'img/blinky.svg');
		var clyde = new Ghost(6*pacman.radius,0,'img/clyde.svg');

			function renderContent()
			{
                //context.save()
				
				// Refresh Score
				score.refresh(".score");
				
				// Whitedots
				for (var k in whiteDotTable.hash) {
					whiteDotTable.hash[k].paint(context);
				}
				
                
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
				pacman.checkCollisions();
				pacman.checkDirectionChange();		
				
				// All dots collected?
				if ((whiteDotTable.empty()) && game.running) {
					alert("You definitely have a lot of time.");
					game.running = false;
				}
					setTimeout(animationLoop, 33);
				
                
			}
            
            animationLoop();
			
			
		});
	
	function doKeyDown(evt){
	
		switch (evt.keyCode)
			{
			case 87:	// W pressed
				directionWatcher.set(up);
				break;
			case 83:	// S pressed 
				directionWatcher.set(down);
				break;
			case 65:	// A pressed
				directionWatcher.set(left);
				break;

			case 68:	// D pressed
				directionWatcher.set(right);
				break;
			}
	}

