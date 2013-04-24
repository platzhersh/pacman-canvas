define(["actors/util/directionWatcher","actors/util/Direction"],function(directionWatcher,Direction) {

    // Super Class for Pacman & Ghosts
    function Figure() {
        this.posX;
        this.posY;
        this.dirX = 1;
        this.dirY = 0;
        this.direction;
        this.stop = true;
        this.directionWatcher = new directionWatcher();
        };
      
    // Functions
    Figure.prototype.checkDirectionChange = function() {};
	Figure.prototype.move = function() {
		if (!this.stop) {
			this.posX += 5 * this.dirX;
			this.posY += 5 * this.dirY;
			
			// Check if out of canvas
			if (this.posX >= game.width-this.radius) this.posX = 5-this.radius;
			if (this.posX <= 0-this.radius) this.posX = game.width-5-this.radius;
			if (this.posY >= game.height-this.radius) this.posY = 5-this.radius;
			if (this.posY <= 0-this.radius) this.posY = game.height-5-this.radius;
			}
		};
	Figure.prototype.stop = function() { this.stop = true;};
	Figure.prototype.start = function() { this.stop = false;};
	
	Figure.prototype.getGridPosX = function() {
		return (this.posX - (this.posX % 30))/30;
	};
	Figure.prototype.getGridPosY = function() {
		return (this.posY - (this.posY % 30))/30;
	};
	Figure.prototype.setDirection = function(dir) {			
		this.dirX = dir.dirX;
		this.dirY = dir.dirY;
		this.angle1 = dir.angle1;
		this.angle2 = dir.angle2;
		this.direction = dir;
	};
	Figure.prototype.setPosition = function(x, y) {
		this.posX = x;
		this.posY = y;
	};
    
    return Figure;

});