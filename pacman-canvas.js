	// global variables
	
	function Direction(name,angle1,angle2,dirX,dirY) {
		this.name = name;
		this.angle1 = angle1;
		this.angle2 = angle2;
		this.dirX = dirX;
		this.dirY = dirY;
	}
	
	function Monster() {
		
	}
	
	var up = new Direction("up",1.75,1.25,0,-1);
	var left = new Direction("left",1.25,0.75,-1,0);
	var down = new Direction("down",0.75,0.25,0,1);
	var right = new Direction("right",0.25,1.75,1,0);
	
	
	var pacman = new Object();
		pacman.posX = 0;
		pacman.posY = 0;
		pacman.radius = 20;
		pacman.angle1 = 0.25;
		pacman.angle2 = 1.75;
		pacman.mouth = 1; /* Switches between 1 and -1, depending on mouth closing / opening */
		pacman.dirX = right.dirX;
		pacman.dirY = right.dirY;
		
		pacman.direction = right;
	
	
	
	$(document).ready(function() {

		window.addEventListener('keydown',doKeyDown,true);

		var canvas = $("#myCanvas").get(0);
		var context = canvas.getContext("2d");
		
		//alert("Pacman created, angle1" + pacman.angle1);


			function renderContent()
			{
                //context.save()
                
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
                renderContent();
				
                pacman.posX += 5 * pacman.dirX;
				pacman.posY += 5 * pacman.dirY;
				
				/* Mouth Animation */
				pacman.angle1 -= pacman.mouth*0.02;
				pacman.angle2 += pacman.mouth*0.02;
				
				var limitMax1 = pacman.direction.angle1;
				var limitMax2 = pacman.direction.angle2;
				var limitMin1 = pacman.direction.angle1 - 0.24;
				var limitMin2 = pacman.direction.angle2 + 0.24;
					
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
				if (pacman.posX >= 500-2*pacman.radius) setDirection(left);
                if (pacman.posX < 0) setDirection(right);
                if (pacman.posY >= 500-2*pacman.radius) setDirection(up);
                if (pacman.posY < 0) setDirection(down);
				*/
				
				// Reenter
				if (pacman.posX >= 500-pacman.radius) pacman.posX = 1-pacman.radius;
				if (pacman.posX <= 0-pacman.radius) pacman.posX = 499-pacman.radius;
				if (pacman.posY >= 500-pacman.radius) pacman.posY = 1-pacman.radius;
				if (pacman.posY <= 0-pacman.radius) pacman.posY = 499-pacman.radius;
				
				
                //if (posX >= 500-2*radius) stopMoving();

                setTimeout(animationLoop, 33);
			}
            
			
            renderGrid(20, "red");
			//renderContent();
            animationLoop();
		});
	
	function doKeyDown(evt){
	
		switch (evt.keyCode)
			{
			case 87:	/* W pressed */
			case 38:  /* Up arrow was pressed */
				setDirection(up);
				break;
			case 83:	/* S pressed */
			case 40:  /* Down arrow was pressed */
				setDirection(down);
				break;
			case 65:	// A pressed
			case 37:  /* Left arrow was pressed */
				setDirection(left);
				break;
			case 68:	// D pressed
			case 39:  /* Right arrow was pressed */
				setDirection(right);
				break;
			}
	}

	function setDirection(dir) {			
		pacman.dirX = dir.dirX;
		pacman.dirY = dir.dirY;
		pacman.angle1 = dir.angle1;
		pacman.angle2 = dir.angle2;
		pacman.direction = dir;
	}

	function stopMoving() {
	pacman.dirX = 0;
	pacman.dirY = 0;
	}