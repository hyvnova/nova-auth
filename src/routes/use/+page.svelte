<!--
    Quick Start Page
    Should be the first page the user sees when they visit /use
    It's supposed to be pretty straightforward and simple.

    Content:
    - Welcome message
    - Usage example
    - Usage details (how to use)
-->

<script lang="ts">
    import CodeBlock from "$lib/components/CodeBlock.svelte";

  let code_url = `params = new URLSearchParams({
    who: "your api key", // You can get your api key from https://nova-auth.vercel.app/me
    callback: "https://your-website.com/callback",
    want: "username,avatar,verified", // You can request any of the following fields: username, avatar, verified, email
});  

let url = "https://nova-auth.vercel.app/auth?" + params.toString(); // This is the URL you need to redirect the user to`

    let code_callback = `# In your callback page, you'll recieve either of this 2 return types
1. If success is true -> { token: URL encoded access_token }
2. If success is false -> { error: "declined" or "error message" }

# Here's how the response URL might look like:
- https://your-website.com/callback?success=true&token=access_token`

    let code_using = `// This is how you can use the access token to get the user's data
// request user info
let res = await fetch(endpoint + '/api/user', {
    method: 'GET',
    headers: {
        'Authorization': \`\${accessToken}\`
    }
});

// check if the response is ok
if (res.ok) {
    // get the response body
    let data = await res.json();
    
    // do something with the data. Remember that only the fields you requested will be returned
    let user: {
        username: string, 
        avatar: string, 
        verified: boolean
    } = data;

    console.log(user);

} else {
    // handle error
}`
</script>

<main class="container p-6 flex flex-col items-center justify-center">
    <h1 class="mb-4">How to use <strong>NoVa Auth</strong>?</h1>

    <div class="container mx-auto mb-4">
        <CodeBlock language="javascript" code={code_url} header="1. Prepare URL"/>
    </div>

    <div class="container mx-auto">
        <CodeBlock language="markdown" code={code_callback} header="2. Callback Response"/>
    </div>

    <div class="container mx-auto">
        <CodeBlock language="javascript" code={code_using} header="3. Using the access token"/>
    </div>
</main>
