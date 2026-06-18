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

let code = '4/0AdkVLPzQ1WGdyRSuLirQ9JjRkcApt3RA7IkvjsjpQdAYDEBN_791Wn-0jYVDt-p1X6Jp9A'
let o = await client.getToken(code)

console.log(o.tokens);

