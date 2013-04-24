define(["game/Sound","actors/Ghost","game/Score","jquery"],function(Sound,Ghost,Score,$) {

    // Manages the whole game ("God Object")
    function Game(mapConfig,pacman) {
        this.running = true;
        this.pause = false;
        this.score = new Score();
        this.soundfx = 0;
        this.mapConfig = mapConfig;
        this.map;
        this.pillCount;	// # of pills
        this.monsters;
        this.level = 1;
        this.canvas = $("#myCanvas").get(0);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.pacman = pacman;
        this.pinky;
        this.blinky;
        this.inky;
        this.clyde;
    };
    
    // Functions
	Game.prototype.toggleSound = function() { 
		this.soundfx == 0 ? this.soundfx = 1 : this.soundfx = 0; 
		$('#mute').toggle();
		};
	Game.prototype.reset = function() {
		};
	Game.prototype.nextLevel = function() {
		this.level++;
		this.init(1);
	};
    Game.prototype.waitForAjax = function () {
        while (this.map == "") {
            console.log("Waiting for ajax callback");
            setTimeout(this.waitForAjax,1000);
        }
    };
    Game.prototype.getMap = function (callback) {
    // get Level Map
		$.ajax({
			url: this.mapConfig,
			async: false,
			 beforeSend: function(xhr){
				if (xhr.overrideMimeType) xhr.overrideMimeType("application/json"); 
			},
			dataType: "json",
			success: function (data) {
                console.log("getMap success");
                console.log("this.map1 ="+this.map);
                console.log("data ="+data);
                this.map = data; // something's fucking wrong here and it ain't my code
                console.log("this.map2 ="+this.map);
                
                var temp = 0;
                $.each(data.posY, function(i, item) {
                   $.each(this.posX, function() { 
                       if (this.type == "pill") {
                        temp++;
                        //console.log("Pill Count++. temp="+temp+". PillCount="+this.pillCount+".");
                        }
                    });
                });
                this.pillCount = temp;
                return data;
			}
		});
    };
	Game.prototype.init = function (state) {
		console.log("init game");  
        
        this.getMap(function(data) { this.map = data; });
		
		$(".lives").html("Lives: "+this.pacman.lives);	
		/*var text = "Insert Coin to Play!";
		context.fillStyle = "#FFF";
		context.font = "20px 'Press Start 2P'";
		context.fillText(text, this.canvas.width/2-200, this.canvas.height/2-10);
		*/
		
		if (state == 0) {
			this.score.set(0);
			this.score.refresh(".score");
			this.pacman.lives = 3;
			}
		this.pacman.reset();
		
		// initalize Ghosts, avoid memory flooding
		if (this.pinky == null) {
			this.pinky = new Ghost(14*this.pacman.radius,10*this.pacman.radius,'img/pinky.svg',this);
			this.inky = new Ghost(16*this.pacman.radius,10*this.pacman.radius,'img/inky.svg',this);
			this.blinky = new Ghost(18*this.pacman.radius,10*this.pacman.radius,'img/blinky.svg',this);
			this.clyde = new Ghost(20*this.pacman.radius,10*this.pacman.radius,'img/clyde.svg',this);
		}
		else {
			//console.log("ghosts reset");
			this.pinky.setPosition(14*this.pacman.radius,10*this.pacman.radius);
			this.pinky.dazzle = false;
			this.inky.setPosition(16*this.pacman.radius,10*this.pacman.radius);
			this.inky.dazzle = false;
			this.blinky.setPosition(18*this.pacman.radius,10*this.pacman.radius);
			this.blinky.dazzle = false;
			this.clyde.setPosition(20*this.pacman.radius,10*this.pacman.radius);
			this.clyde.dazzle = false;
		}
	
	};
	Game.prototype.check = function() {
	if ((this.pillCount == 0) && game.running) {
			alert("Level "+game.level+" complete!\nScore: "+game.score.score+"\nRemaining Lives: "+this.pacman.lives+"\nClick OK to proceed to start the next level.");
			this.nextLevel();
		}
	};
	Game.prototype.win = function () {};
	Game.prototype.gameover = function () {};
	Game.prototype.toPixelPos = function (gridPos) {
		return gridPos*30;
	};
	Game.prototype.toGridPos = function (pixelPos) {
		return ((pixelPos % 30)/30);
	};
    
    return Game;

});