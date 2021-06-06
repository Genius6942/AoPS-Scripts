// ==UserScript==
// @name         Friend count
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  counts friends for any aops profile
// @author       Adventure10
// @match        https://artofproblemsolving.com/community/my-aops
// @match        https://artofproblemsolving.com/community/user/*
// @icon         https://www.google.com/s2/favicons?domain=artofproblemsolving.com
// @grant        none
// ==/UserScript==
 
async function mafs() {
    // setup
    window.go = true;
    window.thelastlocation = location.href;
    window.friends = [];
    function handle (d) { // Handles response data from request, returns promise true or false
        try {
            // second and after reqeust
            window.friends.push(...d.response.friends);
        } catch {
            // first request
            window.friends.push(...d.response.user_data.friends);
        }
        if (d.response.all_friends_loaded == true) {
            // All friends loaded, stop
            window.go = false;
            return Promise.resolve(false);
        }
        // else keep going
        return Promise.resolve(true);
    }
    // No one knows about this...
    function handle_fo (d) {}
    // Creates a new friend data row
    function newthing (first) {
        // New element
        let x = document.createElement('div');
        // stuff inside
        x.innerHTML = `<div>${first}</div><div><img src = "https://artofproblemsolving.com/assets/images/logo-ludicrous.gif" class="cmty-user-profile-data-row-loading"></div>`;
        // class data: AoPS will format
        x.classList.add('cmty-user-profile-data-row');
        return x;
    }
    async function addthingy () { // just adds the element we create with the previous function, but we wait until the page is loaded.
        try {
            await new Promise(r=>setTimeout(r, 1000));
            window.elementdumb=document.getElementsByClassName('cmty-user-profile-data')[1].appendChild(newthing('Friends'));
        } catch (e) {
            await new Promise(r=>setTimeout(r, 300));
            return await addthingy()
        }
    }
    async function checkthem () { // checks if type is your account or someone elses
        let first = await (await fetch("https://artofproblemsolving.com/m/community/ajax.php", {headers: {"content-type": "application/x-www-form-urlencoded"}, method: 'POST', body: `user_identifier=${window.theuserid}&a=fetch_user_profile&aops_logged_in=true&aops_user_id=${window.AoPS.session.user_id}&aops_session_id=${window.AoPS.session.id}`})).json();
        let second = await (await fetch("https://artofproblemsolving.com/m/community/ajax.php", {headers: {"content-type": "application/x-www-form-urlencoded"}, method: 'POST', body: `user_id=${window.theuserid}&last_friend=&fetch_type=initial&a=fetch_friends&aops_logged_in=true&aops_user_id=${window.AoPS.session.user_id}&aops_session_id=${window.AoPS.session.id}`})).json();
        if (first.response == "") return Promise.resolve(second)
        return Promise.resolve(first);
    }
    function reload() { // when the page url changes, run the whole thing again
        mafs();
    }
	// when the url changes, idk if this actually works...
    window.addEventListener('hashchange', function (){console.log('going');reload()})
	// ok this one actually works but it does the same as the above line
    setInterval(function () {if (window.thelastlocation != location.href) {window.thelastlocation=location.href; reload()}},200);
	// Special styling for the loading symbol
    document.getElementsByTagName('head')[0].innerHTML+='<style>.cmty-user-profile-data-row-loading { height: 18px}</style>';
	// add the loading symbol
    await addthingy();
	// set user id
    window.theuserid = window.AoPS.session.user_id;
	// change the user id if we aren't on our own page
    if (location.href.includes('user')) window.theuserid = location.href.substring(location.href.lastIndexOf('/')+1);
	// first request
    let stuff = checkthem();
	// handle first request
    await stuff.then(r=> handle(r));
    // Loop
    while (window.go) {
		// this is where the magic happens
		// ask aops for more data
        let stuff = await fetch("https://artofproblemsolving.com/m/community/ajax.php", {headers: {"content-type": "application/x-www-form-urlencoded"}, method: 'POST', body: `user_id=${window.theuserid}&last_friend=${window.friends[window.friends.length-1].username}&fetch_type=friends&a=fetch_friends&aops_logged_in=true&aops_user_id=${window.AoPS.session.user_id}&aops_session_id=${window.AoPS.session.id}`});
        // handle the data
		await stuff.json().then(r=> handle(r));
    }
	// change the stuffs
    window.elementdumb.childNodes[1].innerHTML = window.friends.length;
}
// run idk why so many things
(function (){mafs()})();
