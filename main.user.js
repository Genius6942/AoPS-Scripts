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
	get loggedIn() {
		if (AoPS.session.user_id != 1) {
			return true;
		}
		return false;
	}
	postToAoPS = function (target, data, options = {allowLatexErrors: true}) {
		if (typeof target == 'string') {
			target = this.parseForumURI(target).thread;
		} else if (typeof target == 'object') {
			target = target.thread;
		} else if (typeof target == 'number') {
			target = parseInt(target);
		} else {
			throw new TypeError('type of target is bad');
		}
		this.requestToAoPS();
	}
	ajax = async function (data) {
		let d = "";
		for (let item of data) {
			d += item.name+':'+item.value+';'
		}
		return await fetch('/m/community/ajax.php', {method: 'POST', headers: {"content-type": "multipart/form-data"}, body: d});
	}
}

(function () {
	AoPS.hax = new Hax();
})();
