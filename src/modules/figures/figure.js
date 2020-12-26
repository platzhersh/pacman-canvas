const {left, right, up, down} = require('../game/direction.js');
const directionWatcher = require('../game/direction-watcher.js');

// Super Class for Pacman & Ghosts
class Figure {
    constructor() {
        this.posX;
        this.posY;
        this.speed;
        this.dirX = right.dirX;
        this.dirY = right.dirY;
        this.direction;
        this.stop = true;
        this.directionWatcher = new directionWatcher();
    }

    getNextDirection = function () { console.log("Figure getNextDirection"); };
    checkDirectionChange = function () {
        if (this.inGrid() && (this.directionWatcher.get() == null)) this.getNextDirection();
        if ((this.directionWatcher.get() != null) && this.inGrid()) {
            //console.log("changeDirection to "+this.directionWatcher.get().name);
            this.setDirection(this.directionWatcher.get());
            this.directionWatcher.set(null);
        }

    }

    inGrid = function () {
        if ((this.posX % (2 * this.radius) === 0) && (this.posY % (2 * this.radius) === 0)) return true;
        return false;
    }
    getOppositeDirection = function () {
        if (this.direction.equals(up)) return down;
        else if (this.direction.equals(down)) return up;
        else if (this.direction.equals(right)) return left;
        else if (this.direction.equals(left)) return right;
    }

    move = function () {

        if (!this.stop) {
            this.posX += this.speed * this.dirX;
            this.posY += this.speed * this.dirY;

            // Check if out of canvas
            if (this.posX >= game.width - this.radius) this.posX = this.speed - this.radius;
            if (this.posX <= 0 - this.radius) this.posX = game.width - this.speed - this.radius;
            if (this.posY >= game.height - this.radius) this.posY = this.speed - this.radius;
            if (this.posY <= 0 - this.radius) this.posY = game.height - this.speed - this.radius;
        }
    }
    stop = function () { this.stop = true; }
    start = function () { this.stop = false; }

    getGridPosX = function () {
        return (this.posX - (this.posX % 30)) / 30;
    }
    getGridPosY = function () {
        return (this.posY - (this.posY % 30)) / 30;
    }
    setDirection = function (dir) {
        this.dirX = dir.dirX;
        this.dirY = dir.dirY;
        this.angle1 = dir.angle1;
        this.angle2 = dir.angle2;
        this.direction = dir;
    }
    setPosition = function (x, y) {
        this.posX = x;
        this.posY = y;
    }
}

module.exports = Figure;