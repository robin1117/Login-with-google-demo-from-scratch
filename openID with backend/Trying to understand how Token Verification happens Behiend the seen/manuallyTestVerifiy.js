import jwt from "jsonwebtoken";
import jwkToPem from 'jwk-to-pem';
import { PUBLICKEY, TOKEN } from "./tokenKeyAndPublicKey.js";

//Whatever the TOKEN we got here is Singed by Google with `RS256` algorithm
//And as far as we know about `RS256` is here we have concept of Private and Public key means to make it verify we need of PUBLIC key, which make available by Google for verification
// Comming to this Public key we have two type of it 
// jwk 
// pme
// both have in its different formate one of the good thing about it is they Interconvertable These keys are in JWK format — convert to PEM using jwk-to-pem since jsonwebtoken needs PEM.

try {
    let output = jwt.verify(TOKEN, PUBLICKEY, {
        algorithms: ['RS256'],
    })
    console.log(output);
} catch (error) {
    console.log(error.message);
}


// Token Verification Steps:
//     -> Fetch keys from v3/certs.
//     -> Extract kid from token header.
//     -> Find matching JWK.
//     -> Convert JWK → PEM.
//     -> Use jwt.verify(token, pem, { algorithms: ["RS256"] }).
//     -> After verifying, check:
//         aud === your client ID
        
// -> Always verify both signature and audience to ensure the token is valid and intended for your app.

