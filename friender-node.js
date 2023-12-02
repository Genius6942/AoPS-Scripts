
const startNum = 1 * 10 ** 6;
let num = startNum;

const num_threads = 15;
const run_thread = async () => {
  while (true) {
    const num_save = num;
    num += 1;
    await fetch("https://artofproblemsolving.com/m/community/ajax.php", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,und;q=0.8,es;q=0.7",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie:
          "optimizelyEndUserId=oeu1701483015061r0.978718471882398; _gcl_au=1.1.672226492.1701483016; _fbp=fb.1.1701483016072.1991360627; _uetsid=ef26b43090b711eebd025dbe9f685098; _uetvid=ef26f28090b711ee8cf06f6b9c548184; _ga=GA1.1.1956437896.1701483016; _hjSessionUser_774800=eyJpZCI6IjlkMDMxYWNkLWM4NzktNTJmOC04NzRkLThhMGI5NmQ1NzVkOSIsImNyZWF0ZWQiOjE3MDE0ODMwMTYyOTgsImV4aXN0aW5nIjpmYWxzZX0=; _hjFirstSeen=1; _hjIncludedInSessionSample_774800=0; _hjSession_774800=eyJpZCI6IjJjYWQ4MGVkLTE4YTAtNDBmNi05MTJhLWNlZGM5MTE2NTgxMyIsImNyZWF0ZWQiOjE3MDE0ODMwMTYzMDEsImluU2FtcGxlIjpmYWxzZSwic2Vzc2lvbml6ZXJCZXRhRW5hYmxlZCI6ZmFsc2V9; _ga_NVWC1BELMR=GS1.1.1701483016.1.0.1701483017.59.0.0; platsessionid__expires=1706667027490; platsessionid=55b1f09c-34db-4077-af97-62fff19a1251.Iymp2vJ4D2EPIksJQsvInB5lncg1Kg0gnS%2Blq5cDxBU; alcumus_init_time=1701483296; cmty_init_time=1701484377",
        Referer: "https://artofproblemsolving.com/",
        "Referrer-Policy": "origin",
      },
      body: `new_friend=${num_save}&a=send_friend_request&aops_logged_in=true&aops_user_id=514308&aops_session_id=6812e13ef59ce3697ad02fa3c84b71b2`,
      method: "POST",
    })
      .then((r) => r.text())
      .then((r) => process.stdout.write(`[success] ${num_save}\r`))
      .catch((e) => process.stdout.write(`[error  ] ${num_save}\r`));
  }
};

for (let i = 0; i < num_threads; i++) {
  run_thread();
}

const start = performance.now();
const timeCheck = () => {
	console.log(
    parseFloat(((num - startNum) / ((performance.now() - start) / 1000)).toFixed(2)),
    "requests per second"
  );
	setTimeout(timeCheck, 1000);
}
timeCheck();