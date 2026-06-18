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

let generatedUri = client.generateAuthUrl({
    scope: ['profile', 'openid', 'email'],
    access_type: "offline",
    prompt: "consent",
    state:"Random Key"
})

console.log(generatedUri);