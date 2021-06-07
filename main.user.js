// ==UserScript==
// @name         AoPS main script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tons of useful functions and stuff
// @author       Adventure10
// @match        https://artofproblemsolving.com/*
// @icon         https://i.ibb.co/jW1jr2M/icon.png
// @grant        none
// ==/UserScript==

class Hax {
	constructor () {
		// Basic data about the user and stuff
		this.id = AoPS.session.user_id;
		this.session_id = AoPS.session.id;
	}
	
	get logged_in() {
		if (AoPS.session.user_id != 1) {
			return true;
		}
		return false;
	}
}

(function () {
	AoPS.hax = new Hax();
})();
