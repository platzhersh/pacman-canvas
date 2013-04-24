define(["actors/Figure","actors/Game","actors/util/directionWatcher"],function(Figure,Game,directionWatcher) {

    // Ghost object in Constructor notation
    function Ghost(posX, posY, image, game) {
        this.posX = posX;
        this.posY = posY;
        this.image = new Image();
        this.image.src = image;
        this.dazzle = false;
        this.dazzleImg = new Image();
        this.dazzleImg.src = 'img/dazzled.svg';
        this.direction = right;
        this.radius = this.game.pacman.radius;
        this.game = game;
        };
        
    // Functions
    Ghost.prototype.draw = function (context) {					
        if (this.dazzle)	context.drawImage(this.dazzleImg, this.posX, this.posY, 2*this.radius, 2*this.radius);
        else context.drawImage(this.image, this.posX, this.posY, 2*this.radius, 2*this.radius);
    };
    Ghost.prototype.getCenterX = function () {
        return this.posX+this.radius;
    };
    Ghost.prototype.getCenterY = function () {
        return this.posY+this.radius;
    };
    
    Ghost.prototype.reset = function() {
        this.posX = 14*this.game.pacman.radius;
        this.posY = 10*this.game.pacman.radius;
        this.dazzle = false;
    };
    
    Ghost.prototype.die = function() {
        this.reset();
    };

    Ghost.prototype.checkCollision = function() {
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
        if ((between(this.game.pacman.getCenterX(), this.getCenterX()-10, this.getCenterX()+10)) 
            && (between(this.game.pacman.getCenterY(), this.getCenterY()-10, this.getCenterY()+10)))
        {
            if (this.game.pacman.beastMode == false) {
                this.game.pacman.die();
                }
            else {
                this.die();
                this.game.score.add(100);
                }
        }
        
    };
    Ghost.prototype.setRandomDirection = function() {
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
    };

    Ghost.prototype = new Figure();
    
    return Ghost;
});