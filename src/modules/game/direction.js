// Direction object in Constructor notation
function Direction(name, angle1, angle2, dirX, dirY) {
    this.name = name;
    this.angle1 = angle1;
    this.angle2 = angle2;
    this.dirX = dirX;
    this.dirY = dirY;
    this.equals = function (dir) {
        return JSON.stringify(this) == JSON.stringify(dir);
    };
}

exports.up = new Direction("up", 1.75, 1.25, 0, -1);		// UP
exports.left = new Direction("left", 1.25, 0.75, -1, 0);	// LEFT
exports.down = new Direction("down", 0.75, 0.25, 0, 1);		// DOWN
exports.right = new Direction("right", 0.25, 1.75, 1, 0);	// RIGHT