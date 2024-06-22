<script lang="ts">
    import { SessionState } from '$lib/types';
    import type { PageData } from './$types';

    export let data: PageData;


</script>

{#if data.state === SessionState.logged}
    <h1>Logged in</h1>
    <p>{data.user.username}</p>
    <img src="{data.user.avatar}" alt="avatar">

{:else if data.state === SessionState.failed}
    <h1>Failed</h1>
    <p>{data.error}</p>
    
{:else}
    <h1>Log In</h1>
    <a href="{data.auth_url}">Auth with Nova-auth</a>
{/if}
