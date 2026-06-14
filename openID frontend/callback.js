
let sid = new URLSearchParams(location.search).get('sid')

if (sid) {
    let res = await fetch(`http://127.0.0.1:3000/set-session-cookie?sid=${sid}`, {
        credentials: 'include'
    })

    if (res.status == 200) {
        window.opener.postMessage({ isLogin: true })
        window.close()
    }
}