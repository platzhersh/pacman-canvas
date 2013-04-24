define(function() {
	// DirectionWatcher
	function directionWatcher() {
		this.dir = null;
    };
    
	directionWatcher.prototype.set = function(dir) {
		this.dir = dir;
	};
	directionWatcher.prototype.get = function() {
		return this.dir;
	};
    
    return directionWatcher;
        
});