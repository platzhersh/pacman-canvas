define(function() {
// Direction object in Constructor notation
    return function Direction(name,angle1,angle2,dirX,dirY) {
        this.name = name;
        this.angle1 = angle1;
        this.angle2 = angle2;
        this.dirX = dirX;
        this.dirY = dirY;
    };
    
});
