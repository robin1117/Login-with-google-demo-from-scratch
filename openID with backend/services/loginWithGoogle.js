console.log('login with google loaded');
import VrifiyToken from "./customTokenVerificationLogic.js";

export async function loginWithGoogle(code) {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUrl = process.env.GOOGLE_REDIRECT_URI;


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
            console.log('Error From loginWithGoogle :', data.error);
            return;
        }
        // console.log(data.id_token);

        // const userToken = data.id_token.split(".")[1]
        // const userData = JSON.parse(atob(userToken));

        let dataAfterVerifiyFromToken = await VrifiyToken(data.id_token)

        if (dataAfterVerifiyFromToken) {
            return dataAfterVerifiyFromToken
        }

    } catch (error) {
        console.log('Error From loginWithGoogle :', error.message);
    }


}
