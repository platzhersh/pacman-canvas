function directionWatcher() {
    this.dir = null;
    this.set = function (dir) {
        this.dir = dir;
    };
    this.get = function () {
        return this.dir;
    };
}

module.exports = directionWatcher;