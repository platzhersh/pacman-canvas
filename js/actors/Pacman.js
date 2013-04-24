define(["actors/Figure","actors/util/directionWatcher"],function(Figure,directionWatcher) {

function Pacman() {
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
    this.direction = right;
	this.beastMode = false;
	this.beastModeTimer = 0;
    this.directionWatcher = new directionWatcher();
    };
    
    // Functions
	Pacman.prototype.getCenterX = function () {
		return this.posX+this.radius;
	};
	Pacman.prototype.getCenterY = function () {
		return this.posY+this.radius;
	};

	Pacman.prototype.checkCollisions = function () {
		
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
			if ((fieldAhead.type === "wall") || (fieldAhead.type === "door")) {
				this.stuckX = this.dirX;
				this.stuckY = this.dirY;
				Pacman.stop();
				// get out of the wall
				if ((this.stuckX == 1) && ((this.posX % 2*this.radius) != 0)) this.posX -= 5;
				if ((this.stuckY == 1) && ((this.posY % 2*this.radius) != 0)) this.posY -= 5;
				if (this.stuckX == -1) this.posX += 5;
				if (this.stuckY == -1) this.posY += 5;
			}
			
		}
	};
    
    
	Pacman.prototype.checkDirectionChange = function() {
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
	};
	Pacman.prototype.setDirection = function(dir) {			
		this.dirX = dir.dirX;
		this.dirY = dir.dirY;
		this.angle1 = dir.angle1;
		this.angle2 = dir.angle2;
		this.direction = dir;
	};
	Pacman.prototype.enableBeastMode = function() {
		this.beastMode = true;
		this.beastModeTimer = 240;
		console.log("Beast Mode activated!");
		inky.dazzle = true;
		pinky.dazzle = true;
		blinky.dazzle = true;
		clyde.dazzle = true;
	};
	Pacman.prototype.disableBeastMode = function() { 
		this.beastMode = false; 
		console.log("Beast Mode is over!");
		inky.dazzle = false;
		pinky.dazzle = false;
		blinky.dazzle = false;
		clyde.dazzle = false;
		};
	Pacman.prototype.move = function() {
	
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
		};
	
	Pacman.prototype.eat = function () {
	
		if (this.dirX == this.dirY == 0) {
		
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
	};
	
	Pacman.prototype.stop = function() {
		this.dirX = 0;
		this.dirY = 0;
	};
	Pacman.prototype.reset = function() {
		this.posX = 0;
		this.posY = 6*2*this.radius;
		this.setDirection(right);
		this.stop();
		this.stuckX = 0;
		this.stuckY = 0;
		console.log("reset Pacman");
	};
	
	Pacman.prototype.die = function() {
		this.reset();
		pinky.reset();
		inky.reset();
		blinky.reset();
		clyde.reset();
		this.lives--;
		if (this.lives == 0) {
			alert("Game over!\nTotal Score: "+game.score.score);
			game.init(0);
			}
		$(".lives").html("Lives: "+this.lives);	
		Sound.play("die");
		};
	Pacman.prototype.getGridPosX = function() {
		return (this.posX - (this.posX % 30))/30;
	};
	Pacman.prototype.getGridPosY = function() {
		return (this.posY - (this.posY % 30))/30;
	};
    
    return Pacman;

});