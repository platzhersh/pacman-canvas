pacman-canvas
=============

An old classic, re-written in HTML5.
Visit http://pacman.platzh1rsch.ch to see it live.

Sounds from 
http://soundfxcenter.com/ and http://soundfxnow.com/

If you like this project, feel free to buy me a coffee:

<a href="https://www.buymeacoffee.com/platzh1rsch" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>


------

License
=======

Feel free to use / copy / modify my code, as long as you reshare your version and give some credit to the original author (me).

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Pacman Canvas</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://platzh1rsch.ch" property="cc:attributionName" rel="cc:attributionURL">Platzh1rsch</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/platzhersh/pacman-canvas" rel="dct:source">https://github.com/platzhersh/pacman-canvas</a>.


Get started
===========

To just run the game locally, run `npm start`.
If you want to see the console logs in your browser, use the `npm run start:dev` instead.

To modify the game for your needs, look at the `pacman-canvas.js` file and make your modifications.
To change the look and feel, edit the `pacman-canvas.css` file or also the `index.htm`file, where everything comes together.

------

Version history
===============

*Version 1.0.5 - 22.03.2021*
* add webpack config
* fix finished game state
* show console logs when started locally

*Version 1.0.4 - 26.12.2020*
* remove highscore reset endpoint

*Version 1.0.3 - 26.12.2020*
* fix speed issue

*Version 1.0.2 - 26.12.2020*
* add get started section in README
* limit to 10 levels for now
* small refactorings
* add score validation in JS

*Version 1.0.1 - 6.10.2020*
* add `bump-version.sh` to make versioning easier

*Version 1.0.0 - 5.9.2020*
* use "default" version number format, go up to 1.0.0
* add `package.json`
* add `server.js`
* you can now run pacman running an express JS server, using `npm start`
* don't use ajax `async: false` anymore to load map config, since it has been marked as deprecated

*Version 0.93 - 8.1.2020*
* add `ads.txt`

*Version 0.92 - 6.3.2018*
* remove navigator.vibrate() calls

*Version 0.91 - 15.01.2016*
* more tests to avoid cheaters
* better highscore form validation
* timer integrated (not in use yet)
* "your screen is too small to play in landscape view" message removed
* fix number of points for eating a ghost

*Version 0.9 - 15.10.2015*
* different difficulties depending on level
* scatter / chase indicated through wall colour
* extended instructions

*Version 0.87 - 08.10.2015*
* fix a bug that allowed resuming a game after game over

*Version 0.86 - 25.05.2015*
* some security fixes to avoid cheaters from adding highscores

*Version 0.84 - 09.11.2014*
* fixed bug that caused game to crash when leaving game area to the right side while holding the right arrow

*Version 0.83 - 07.05.2014*
* not possible to stop by turning into walls anymore
* mute / unmute the game by pressing the "M" key

*Version 0.82 - 02.04.2014*
* small bugfixes
* swipe gestures detection on the whole screen not only game area

*Version 0.81 - 16.03.2014*
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
