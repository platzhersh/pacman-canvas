	// global variables
	
	
	function Score() {
		this.score = 0;
		this.add = function(i) {
			this.score += i;
		}
		this.refresh = function(h) {
			$(h).html("Score: "+this.score);
		}
		
	}
	var score = new Score();
	
	
	
	// Direction object in Constructor notation
	function Direction(name,angle1,angle2,dirX,dirY) {
		this.name = name;
		this.angle1 = angle1;
		this.angle2 = angle2;
		this.dirX = dirX;
		this.dirY = dirY;
	}
	
	// Direction Objects
	var up = new Direction("up",1.75,1.25,0,-1);		// UP
	var left = new Direction("left",1.25,0.75,-1,0);	// LEFT
	var down = new Direction("down",0.75,0.25,0,1);		// DOWN
	var right = new Direction("right",0.25,1.75,1,0);	// RIGHT
	
	
	// Monster object in Constructor notation
	function Monster(posX, posY, color) {
		this.posX = posX;
		this.posY = posY;
		this.color = color;
		//this.direction = ;
		this.radius = pacman.radius;
	}
	Monster.prototype.paint = function (context) {					
		// Monster Draft
		context.beginPath();
		context.fillStyle = this.color;
		context.strokeStyle = this.color;
		context.arc(this.posX,this.posY,this.radius,0*Math.PI,2*Math.PI);
		context.lineTo(this.posX,this.posY);
		context.stroke();
		context.fill();
	}
	
	// whiteDot object in Constructor notation
	function whiteDot(posX, posY) {
		this.posX = posX;
		this.posY = posY;
		this.radius = pacman.radius / 5;
		this.color = "White";
		
		// IMPORTANT: create new whiteDot instances with new whiteDot(..)
		whiteDotTable.add(this);
	}
	
	whiteDot.prototype.paint = function (context) {
		context.beginPath();
		context.fillStyle = "White";
		context.strokeStyle = "White";
		context.arc(this.posX,this.posY,this.radius,0*Math.PI,2*Math.PI);
		context.lineTo(this.PosX, this.PosY);
		context.stroke();
		context.fill();
	}
	
	// Monitors all the white Dots
	function whiteDotTable() {
		this.hash = new Object();
		this.add = function (whiteDot) {
			var key = whiteDot.posX.toString()+whiteDot.posY.toString();
			this.hash[key] = whiteDot;
		}
		this.getAll = function () {
			for (var k in this.hash) {
				console.log("key is: "+k + ", value is: "+this.hash[k]);
			}
		}
		this.get = function(key) {
			return this.hash[key] !== null ? this.hash[key] : false;
		}
		this.remove = function(key) {

			delete this.hash[key]
			console.log("nom nom "+key);
		}
		this.size = function () {
			var count = 0;
			for (var k in this.hash) {
				count++;
			}
			return count;
		}
		this.empty = function() {
			return (this.size() == 0);
		}
	}

	var whiteDotTable = new whiteDotTable();
	
	
	var pacman = new Object();
		pacman.posX = 0;
		pacman.posY = 0;
		pacman.radius = 15;
		pacman.angle1 = 0.25;
		pacman.angle2 = 1.75;
		pacman.mouth = 1; /* Switches between 1 and -1, depending on mouth closing / opening */
		pacman.dirX = right.dirX;
		pacman.dirY = right.dirY;
		
		pacman.direction = right;
		
		pacman.checkCollisions = function () {
			var key = (pacman.posX+pacman.radius).toString()+(pacman.posY+pacman.radius).toString();
			var dot = whiteDotTable.get(key);
			if (dot != null) {
				//console.log("Collision at "+pacman.posX+","+pacman.posY+". (key: "+key+")");
				whiteDotTable.remove(key);
				score.add(10);
				}
			}
		pacman.setDirection = function(dir) {			
			pacman.dirX = dir.dirX;
			pacman.dirY = dir.dirY;
			pacman.angle1 = dir.angle1;
			pacman.angle2 = dir.angle2;
			pacman.direction = dir;
		}

		pacman.stop = function() {
			pacman.dirX = 0;
			pacman.dirY = 0;
		}
		
	
	
	
	$(document).ready(function() {

		window.addEventListener('keydown',doKeyDown,true);

		var canvas = $("#myCanvas").get(0);
		var context = canvas.getContext("2d");
		
		//alert("Pacman created, angle1" + pacman.angle1);
		
		// Whitedots vorbereiten
		for (var i = pacman.radius; i < canvas.width; i +=2*pacman.radius) {
			for (var j = pacman.radius; j < canvas.height; j+= 2*pacman.radius) {
			var dot = new whiteDot(i,j);
			}
		}

			function renderContent()
			{
                //context.save()
				
				// Refresh Score
				score.refresh(".score");
				
				// Whitedots
				for (var k in whiteDotTable.hash) {
					whiteDotTable.hash[k].paint(context);
				}
				
				var monster1 = new Monster(pacman.radius, pacman.radius,"Pink");
				monster1.paint(context);
				
				var monster2 = new Monster(135, 135,"Green");
				monster2.paint(context);
				
				// Pac Man
				context.beginPath();
				context.fillStyle = "Yellow";
				context.strokeStyle = "Yellow";
				context.arc(pacman.posX+pacman.radius,pacman.posY+pacman.radius,pacman.radius,pacman.angle1*Math.PI,pacman.angle2*Math.PI);
				context.lineTo(pacman.posX+pacman.radius, pacman.posY+pacman.radius);
				context.stroke();
				context.fill();
                
                //context.restore();
			}
            
            function renderGrid(gridPixelSize, color)
            {
                context.save();
                context.lineWidth = 0.5;
                context.strokeStyle = color;
                
                // horizontal grid lines
                for(var i = 0; i <= canvas.height; i = i + gridPixelSize)
                {
                    context.beginPath();
                    context.moveTo(0, i);
                    context.lineTo(canvas.width, i);
                    context.closePath();
                    context.stroke();
                }
                
                // vertical grid lines
                for(var i = 0; i <= canvas.width; i = i + gridPixelSize)
                {
                    context.beginPath();
                    context.moveTo(i, 0);
                    context.lineTo(i, canvas.height);
                    context.closePath();
                    context.stroke();
                }
                
                context.restore();
            }
            
            function animationLoop()
            {
                canvas.width = canvas.width;
				renderGrid(pacman.radius, "red");
                renderContent();
				
				
				// Move forward
				
                pacman.posX += 5 * pacman.dirX;
				pacman.posY += 5 * pacman.dirY;
				
				
				
				pacman.checkCollisions();
				
				/* Mouth Animation */
				pacman.angle1 -= pacman.mouth*0.07;
				pacman.angle2 += pacman.mouth*0.07;
				
				var limitMax1 = pacman.direction.angle1;
				var limitMax2 = pacman.direction.angle2;
				var limitMin1 = pacman.direction.angle1 - 0.21;
				var limitMin2 = pacman.direction.angle2 + 0.21;
					
					//alert("Direction: "+pacman.direction+", limitMin1 = "+limitMin1+" limit2 = "+limitMin2+" mouth = "+pacman.mouth+" angle1 = "+pacman.angle1+" angle2 = "+pacman.angle2);
					
				if (pacman.angle1 < limitMin1 || pacman.angle2 > limitMin2)
				{
					pacman.mouth = -1;
				}
				if (pacman.angle1 >= limitMax1 || pacman.angle2 <= limitMax2)
				{
					pacman.mouth = 1;
				}
				
				
				// Border Handling
                /*
				Turn 180?
				if (pacman.posX >= 500-2*pacman.radius) pacman.setDirection(left);
                if (pacman.posX < 0) pacman.setDirection(right);
                if (pacman.posY >= 500-2*pacman.radius) pacman.setDirection(up);
                if (pacman.posY < 0) pacman.setDirection(down);
				*/
				
				// Reenter
				if (pacman.posX >= 500-pacman.radius) pacman.posX = 5-pacman.radius;
				if (pacman.posX <= 0-pacman.radius) pacman.posX = 495-pacman.radius;
				if (pacman.posY >= 500-pacman.radius) pacman.posY = 5-pacman.radius;
				if (pacman.posY <= 0-pacman.radius) pacman.posY = 495-pacman.radius;
				
				
                //if (posX >= 500-2*radius) stopMoving();
				
				// All dots collected?
				if (whiteDotTable.empty()) {
					alert("You definitely have a lot of time.");
				} else {
					setTimeout(animationLoop, 33);
				}
                
			}
            
            animationLoop();
			
			
		});
	
	function doKeyDown(evt){
	
		switch (evt.keyCode)
			{
			case 87:	/* W pressed */
			case 38:  /* Up arrow was pressed */
				pacman.setDirection(up);
				break;
			case 83:	/* S pressed */
			case 40:  /* Down arrow was pressed */
				pacman.setDirection(down);
				break;
			case 65:	// A pressed
			case 37:  /* Left arrow was pressed */
				pacman.setDirection(left);
				break;
			case 68:	// D pressed
			case 39:  /* Right arrow was pressed */
				pacman.setDirection(right);
				break;
			}
	}

