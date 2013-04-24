define(function() {

    function Score() {
        this.score = 0;
    };
    
    Score.prototype.set = function(i) {
        this.score = i;
    };
    Score.prototype.add = function(i) {
        this.score += i;
    };
    Score.prototype.refresh = function(h) {
        $(h).html("Score: "+this.score);
    };
    
    return Score;
});