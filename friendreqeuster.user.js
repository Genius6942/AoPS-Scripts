// ==UserScript==
// @name         Friend requester
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world of AoPS!
// @author       You
// @match        https://artofproblemsolving.com/*
// @icon         https://www.google.com/s2/favicons?domain=artofproblemsolving.com
// @grant        none
// ==/UserScript==
 
(function() {
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key == '/') {
            console.log(cur())
            window.AoPS.Community.Views.throwLoaderBlockingMessage("Calculating time...");
            window.thelasttime = cur();
            setTimeout(() => {alert(cur().toString() + ', ' + (cur() - window.thelasttime).toString() + ' rps')}, 1000);
        }
    })
    localStorage.setItem('friend-now', (cur() || 2));
    async function dostuff () {
        await fetch('https://artofproblemsolving.com/m/community/ajax.php', {method: 'POST', headers: {'content-type': "application/x-www-form-urlencoded"}, body: `new_friend=${cur()}&a=send_friend_request&aops_logged_in=true&aops_user_id=${window.AoPS.session.user_id}&aops_session_id=${window.AoPS.session.id}`});
        dostuff();
        localStorage.setItem('friend-now', cur() + 1);
    }
    function cur () {
        try {
            return parseInt(localStorage.getItem('friend-now'));
        } catch (e) {
            return false
        }
    }
    //window.cur = cur()
    dostuff();
})();
