let access_token = 'ya29.a0AT............'

let refresh_token = '1//0g30E............'

let userinfo_endpoint = "https://openidconnect.googleapis.com/v1/userinfo"

let res = await fetch(userinfo_endpoint, {
    headers: {
        'Authorization': `Bearer ${access_token}`
    }
})

let UserData = await res.json()
console.log(UserData); //