define(function() {
// used to play sounds during the game

    function Sound() {
        this.name = "sound object";
    };
    
    Sound.prototype.play = function (sound) {
        if (game.soundfx == 1) {
            var audio = document.getElementById(sound);
            (audio != null) ? audio.play() : console.log(sound+" not found");
            }
    };
    
    return Sound;

});