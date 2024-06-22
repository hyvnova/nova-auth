# NoVa Auth
A simple authentication service that allows you to easily authenticate users and retrieve their information.

### How to Use
1. Generate Authentication URL
First, create a URL to redirect the user to for authentication.

```typescript
let params = new URLSearchParams({
    who: "your api key", // Get your API key from https://nova-auth.vercel.app/me
    callback: "https://your-website.com/callback",
    want: "username,avatar,verified", // You can request any of the following fields: username, avatar, verified, email
});

let url = "https://nova-auth.vercel.app/auth?" + params.toString(); // Redirect the user to this URL
```

2. Handle Callback
In your callback page, you'll receive one of two return types:

    <b>Success</b>:
    - URL example: https://your-website.com/callback?success=true&token=access_token
    - Contains the access token.

    <b>Failure</b>:

    - URL example: https://your-website.com/callback?success=false&error=error_message
    - Contains an error message.

3. Use the Access Token

```typescript
// Request user info
let res = await fetch('https://nova-auth.vercel.app/api/user', {
    method: 'GET',
    headers: {
        'Authorization': accessToken
    }
});

// Handle errors...
// 400 - Bad Request: No access token provided
// 401 - Unauthorized: Invalid access token
if (!res.ok) {
    // Handle the error
    return;
}

// Get the response body -- User data
let data = await res.json();

// Do something with the data. Remember that only the fields you requested will be returned
let user: {
    username: string, 
    avatar: string, 
    verified: boolean
} = data;
```
#### Notes
Ensure your callback URL is correctly configured to handle the parameters.
Only the fields you requested will be returned in the user data.
For more details, visit the Nova Auth Documentation.

