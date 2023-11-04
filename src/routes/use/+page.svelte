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
    want: "username,avatar", // Want it's optional, by default it returns username
});  

let url = "https://nova-auth.vercel.app/auth?" + params.toString(); // This is the URL you need to redirect the user to`

    let code_callback = `# In your callback page, you'll recieve either of this 2 return types
1. If success is true -> { token: access_token }
2. If success is false -> { error: "error message" }

# Here's of the response URL might look like:
- https://your-website.com/callback?success=true&token=access_token`
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
