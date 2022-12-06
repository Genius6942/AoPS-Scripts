// ==UserScript==
// @name         Friend count
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  counts friends for any aops profile
// @author       Adventure10
// @match        https://artofproblemsolving.com/community/my-aops
// @match        https://artofproblemsolving.com/community/user/*
// @icon         https://www.google.com/s2/favicons?domain=artofproblemsolving.com
// @grant        none
// ==/UserScript==
 
const countFriends = async () => {
  // setup
  let continueLoad = true;
  let prevLoc = location.href;
  const friends = [];
  const handle = async (data) => {
    const res = data.response;
    // Handles response data from request, returns promise true or false
    try {
      // second and after reqeust
      friends.push(...res.friends);
    } catch {
      // first request
      friends.push(...res.user_data.friends);
    }
    if (data.response.all_friends_loaded == true) {
      // All friends loaded, stop
      continueLoad = false;
      return false;
    }
    // else keep going
    return true;
  };
  // Creates a new friend data row
  function createProfileElement(first) {
    // New element
    const div = document.createElement("div");
    // stuff inside
    div.innerHTML = `<div>${first}</div><div><img src = "https://artofproblemsolving.com/assets/images/logo-ludicrous.gif" class="cmty-user-profile-data-row-loading"><span class="friend-count" style="margin-left: 4px;"></span></div>`;
    // class data: AoPS will format
    div.classList.add("cmty-user-profile-data-row");
    return div;
  }

  async function addFriendCountElement() {
    // just adds the element we create with the previous function, but we wait until the page is loaded.
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const el = document
        .getElementsByClassName("cmty-user-profile-data")[1]
        .appendChild(createProfileElement("Friends"));
      return el;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 300));
      return await addFriendCountElement();
    }
  }
  async function checkAccountType() {
    // checks if type is your account or someone elses
    let first = await (
      await fetch("https://artofproblemsolving.com/m/community/ajax.php", {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        method: "POST",
        body: `user_identifier=${uid}&a=fetch_user_profile&aops_logged_in=true&aops_user_id=${window.AoPS.session.user_id}&aops_session_id=${window.AoPS.session.id}`,
      })
    ).json();
    let second = await (
      await fetch("https://artofproblemsolving.com/m/community/ajax.php", {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        method: "POST",
        body: `user_id=${uid}&last_friend=&fetch_type=initial&a=fetch_friends&aops_logged_in=true&aops_user_id=${window.AoPS.session.user_id}&aops_session_id=${window.AoPS.session.id}`,
      })
    ).json();
    if (first.response == "") return Promise.resolve(second);
    return Promise.resolve(first);
  }
  function reload() {
    // when the page url changes, run the whole thing again
    mafs();
  }
  // when the url changes, idk if this actually works...
  window.addEventListener("hashchange", function () {
    console.log("going");
    reload();
  });
  // ok this one actually works but it does the same as the above line
  setInterval(function () {
    if (prevLoc != location.href) {
      prevLoc = location.href;
      reload();
    }
  }, 200);
  // Special styling for the loading symbol
  document.getElementsByTagName("head")[0].innerHTML +=
    "<style>.cmty-user-profile-data-row-loading { height: 18px}</style>";
  // add the loading symbol
  const friendCountElement = await addFriendCountElement();
  // set user id
  let uid = window.AoPS.session.user_id;
  // change the user id if we aren't on our own page
  if (location.href.includes("user"))
    uid = location.href.substring(location.href.lastIndexOf("/") + 1);
  // first request
  let accountRes = checkAccountType();
  // handle first request
  await accountRes.then((r) => handle(r));
  // Loop
  while (continueLoad) {
    // this is where the magic happens
    // ask aops for more data
    const res = await fetch("https://artofproblemsolving.com/m/community/ajax.php", {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: `user_id=${uid}&last_friend=${
        friends[friends.length - 1].username
      }&fetch_type=friends&a=fetch_friends&aops_logged_in=true&aops_user_id=${
        window.AoPS.session.user_id
      }&aops_session_id=${window.AoPS.session.id}`,
    });
    // handle the data
    await res.json().then((r) => handle(r));
    document.querySelector(".friend-count").innerHTML = friends.length;
  }
  // change the stuffs
  friendCountElement.childNodes[1].innerHTML = friends.length;
};
// run idk why so many things
(function () {
  countFriends();
})();
