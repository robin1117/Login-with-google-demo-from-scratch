import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();


const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUrl = process.env.GOOGLE_REDIRECT_URI;

let client = new OAuth2Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirectUri: redirectUrl
})

let refresh_token = '1//0g30Eu0...............'

client.setCredentials({
    refresh_token: refresh_token,
    expiry_date:3600000000
})

console.log(await client.refreshAccessToken());