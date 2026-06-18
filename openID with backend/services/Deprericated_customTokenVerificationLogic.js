import jwk from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { TOKEN,PUBLICKEY } from "../Trying to understand how Token Verification happens Behiend the seen/tokenKeyAndPublicKey.js";

// JwtToken = '<Header>.<Payload>.<Signature>'
export default async function verifyIdToken(idToken) {
    try {
        const header = JSON.parse(atob(idToken.split(".")[0])) //Extracting Header from, JWT token
        const cliendId = process.env.GOOGLE_CLIENT_ID

        const res = await fetch("https://www.googleapis.com/oauth2/v3/certs")
        const data = await res.json()
        const key = data.keys.find((key) => key.kid === header.kid) // Finding Exact key
        const pem = jwkToPem(key) // converting Jwt ...pem
        const verify = jwk.verify(idToken, pem, { //verifying pem 
            algorithms: ["RS256"]
        })
        if (!verify) {
            return false
        }
        if (verify.aud !== cliendId) { //checking is this token really intended for your device ?
            return false
        }
        return verify
    } catch (error) {
        console.log('Error From Verificaiton :',error.message);
        return false
    }

}


