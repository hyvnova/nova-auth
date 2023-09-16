<script lang="ts">
    import ActionCard from "$lib/components/ActionCard.svelte";
    import type { PageServerData } from "./$types";

    import { faUserEdit } from "@fortawesome/free-solid-svg-icons";

    export let data: PageServerData;

</script>

<svelte:head>
    <title>Me</title>
</svelte:head>


<div class="bg w-screen h-screen flex flex-col justify-center items-center">
    

    <main>
        <div class="flex justify-center items-center m-1">
            <h1 class="text-3xl font-bold">Quick Actions</h1>
        </div>

        <ActionCard
            icon={faUserEdit}
            title="Edit Profile"
            destination="/me/edit"
        />
    </main>
</div>

<style>
    .bg {
        background-image: url("./assets/dark_bg.jpg");
        background-repeat: no-repeat;
        background-attachment: fixed; /* Optional - keeps the background fixed while scrolling */
    }
</style>
