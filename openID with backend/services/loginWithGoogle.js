import { OAuth2Client } from "google-auth-library";
// import VrifiyToken from "./customTokenVerificationLogic.js";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUrl = process.env.GOOGLE_REDIRECT_URI;

//setting-up Google client
let client = new OAuth2Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirectUri: redirectUrl
})

//generating auth Url 
export function generateAuthUrl(params) {
    let generatedUri = client.generateAuthUrl({
        scope: ['profile', 'openid', 'email'],
        access_type: "offline",
        prompt: "consent",
        state: "Random Key Sting Added to Url"
    })
    return generatedUri;
}

//Extract User Information from the Token Received from Google's Token Endpoint
export async function loginWithGoogle(code) {
    try {

        let result = await client.getToken(code)
        let data = result.tokens
        // console.log(data);
        
        if (data.error) {
            console.log('Error From loginWithGoogle :', data.error);
            return;
        }
        // console.log(data.id_token);

        let loginTicket = await client.verifyIdToken({
            idToken: data.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        return loginTicket.payload

    } catch (error) {
        console.log('Error From loginWithGoogle :', error.message);
    }


}
