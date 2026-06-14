let button = document.querySelector("button");

const clientId = "475216737217-nv9trlpu0q8qliqnp29kbjne3iupulva.apps.googleusercontent.com";
const redirectUrl = "http://127.0.0.1:5500/callback.html";

button.addEventListener("click", (event) => {
    window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&scope=openid email profile&redirect_uri=${redirectUrl}`,
        "loginPopup",
        "width=500 height=500",
    );
});

window.addEventListener("message", async (e) => {
    let res = await fetch("http://127.0.0.1:3000/sent-code", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: e.data }),
    });
    let { data, isLogin } = await res.json()
    if (isLogin) {
        window.location = '/profile'
    }


});
