<script lang="ts">
    import type { PageServerData } from "./$types";

    export let data: PageServerData
</script>

<h1 class="text-3xl font-bold">Welcome back! {data.username}</h1>