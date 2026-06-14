let button = document.querySelector("button");

// const clientId = "475216737217-nv9trlpu0q8qliqnp29kbjne3iupulva.apps.googleusercontent.com";
// const redirectUrl = "http://127.0.0.1:3000/get-code";

button.addEventListener("click", (event) => {
    window.open(
        `http://127.0.0.1:3000/auth/google`,
        // `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&scope=openid email profile&redirect_uri=${redirectUrl}`,
        "loginPopup",
        "width=500 height=500",
    );
});

window.addEventListener("message", async (e) => {
    let { data, isLogin } = e.data
    if (isLogin) {
        window.location = '/profile'
    }
});
