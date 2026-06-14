console.log('login with google loaded');
export async function loginWithGoogle(code) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUrl = "http://127.0.0.1:3000/get-code";

    
    const payload = `code=${code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUrl}&grant_type=authorization_code`;

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload,
    });

    const data = await response.json();

    if (data.error) {
        console.log("Error occurred");
        console.log(data);
        return;
    }

    const userToken = data.id_token.split(".")[1]
    const userData = JSON.parse(atob(userToken));
    return userData
}
