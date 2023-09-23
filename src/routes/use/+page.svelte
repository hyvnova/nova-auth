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

    let code_url = `
    // There are only 3 parameters you need to pass to the URL
    // 1. who: your username
    // 2. callback: the URL to redirect to after the user logs in
    // 3. want: username, avatar, or email 
    
    let params = new URLSearchParams({
        who: "your_username",
        callback: "https://your-website.com/callback",
        want: "username,avatar", // Want it's optional, by default it returns username
    });  
    
    let url = "https://nova-auth.vercel.app/auth?" + params.toString(); // This is the URL you need to redirect the user to
    `

    let code_callback = `
    In your callback page, you'll recieve either of this 2 return types
    If success is true -> { username: "username", avatar: "avatar_url" }
    If success is false -> { error: "error message" }

    Here's of the response URL might look like:
    https://your-website.com/callback?success=true&username=your_username&avatar=your_avatar_url
    `
</script>

<main class="p-6 flex flex-col items-center justify-center">
    <h1 class="mb-4">How to use <strong>NoVa Auth</strong>?</h1>

    <div class="container mx-auto">
        <CodeBlock language="javascript" code={code_url} header="Prepare URL"/>
    </div>

    <div class="container mx-auto">
        <CodeBlock language="markdown" code={code_callback} header="Calback Response"/>
    </div>
</main>
