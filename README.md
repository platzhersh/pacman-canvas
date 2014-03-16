pacman-canvas
=============

An old classic, re-written in HTML5.
Visit http://pacman.platzh1rsch.ch to see it live.

Sounds from 
http://soundfxcenter.com/ and http://soundfxnow.com/

------

changes
======

*Version 0.81 - 16.03.2014*
* JS Injection protection
* logging IP & user-agent of Higscore-Entries
* Ghost AI almost like in the original Pacman

*Version 0.8 - 13.11.2013*
* Ghost Modes Scatter & Chase
* Pathfinding AI for Blinky
* Ghosts need to return to Ghost House when dead

*Version 0.8 - 13.11.2013*
* lots of small changes in the backend
* when you go in landscape mode and your screen is too small to display the whole site, you get notified to rotate your phone into portrait mode
* all onClick and onMousedown in HTML removed and replaced by EventListeners in JavaScript
* Pacman Canvas now uses ApplicationCache to cache its content, so you can play the game offline!

*Version 0.78 - 05.11.2013*
* navigation via buttons should be less delayed by using onMouseDown event instead of onClick
* refreshRate is now a game attribute and could be changed easily during the game (not yet implemented in frontend)

*Version 0.77 - 24.05.2013*
* Ghosts start to blink before to undazzle
* Pacman now dies with style

*Version 0.76 - 02.05.2013*
* You can now use the usual arrow keys to control pacman
* fixed 2 small bugs regarding KeyEvents

*Version 0.75 - 28.04.2013*
* You can pause / resume the game by pressing SPACE
* ESC is no longer used to pause / resume, but to go back to the main view
* Game Menu only showing while game is paused
* some css tweaks
* Simple Highscore implemented using Ajax, Json and Sqlite3

*Version 0.74 - 25.04.2013*
* You can pause / resume the game by pressing ESC or clicking into canvas
* Swipe Gestures using hammerjs
* replaced alerts by nice html overlay messages

*Version 0.73 - 17.04.2013*
* You can play on until you lost all your 3 lives
* Ghosts state gets reset everytime they get eaten or new level starts

*Version 0.72 - 30.01.2013*
* Ghost Base Door
* Reset Game after winning

*Version 0.71 - 30.01.2013*
* Ghosts can die too

*Version 0.7 - 29.01.2013*
* Powerpills & Beastmode

*Version 0.63 - 29.01.2013*
* Pills now get loaded over external json file (map.json)
* ghost collisions implemented -> dying
* tried to clean up the code a bit

*Version 0.62 - 23.01.2013*
* disable zoom on Mobile
* change name to Pacman Canvas (Alpha)

*Version 0.61 - 12.01.2013*
* all walls defined (incl. collisions)

*Version 0.6 - 12.01.2013*
* small fixes for mobile view
* sound control (default: muted)
* collision control for walls
* json datastructure design for all game objects (pills, magic pills, walls)

*Version 0.41 - 10.12.2012*
* Mobile Design Fix
* New Icon

*Version 0.40 - 08.12.2012*
* Control Buttons for mobile
* Small Design Updates

*Version 0.30 - 05.12.2012*
* Touch Support via jGestures
* Responsive
		
*Version 0.20 - 22.11.2012*
* Code Refactored for further development
* Sound added
* Appcache implemented
	
*Version 0.13 - 29.10.2012*
* Never miss a dot: Pacman now always stays in the grid.
			
*Version 0.12 - 19.10.2012*
* Pacman is now able to eat the dots. Eating a dot equals 10 points for now.
* LiveScore implemented.
* Game ends when all dots are eaten.

*Version 0.11 - 15.10.2012*
* Placing white Dots and storing them in a Hashtable
* Monster/Ghost Prototype
* Score Prototype
* Pacman had to get smaller (r=15px)
* Display Grid
* Refactoring HTML
		
*Version 0.10 - 23.08.2012*
* Started cleaning up the code using Objects
* Pacman now turns around when changing directions
