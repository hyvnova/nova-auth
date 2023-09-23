<script lang="ts">
    import ActionCard from "$lib/components/ActionCard.svelte";
    import {
        faEye,
        faGear,
        faUserEdit,
    } from "@fortawesome/free-solid-svg-icons";
    import type { PageServerData } from "./$types";
    import { redirect } from "@sveltejs/kit";

    export let data: PageServerData;


    function handleSession(action: string) {
        fetch("/api/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: action,
            }),
        }).then(() => {
            window.location.href = "/";
        });
    }
</script>

<div class="h-screen flex flex-col items-center">
    <header class="pt-4 flex flex-col items-center">
        <h2 class="text-2xl mb-4">Quick Actions</h2>
        <div class="flex flex-wrap justify-center">
            <ActionCard
                icon={faUserEdit}
                title="Edit Profile"
                destination="/profile/{data.username}?show_edit=true"
            />
            <ActionCard
                icon={faGear}
                title="Settings"
                destination="/settings"
            />
            <ActionCard icon={faEye} title="View Data" destination="/data" />

        </div>
    </header>


    <button class="mt-4 p-2 bg-red-500 rounded-md text-white" on:click={() => {handleSession("logout")}}>Logout</button>
    <button class="mt-4 p-2 bg-red-500 rounded-md text-white" on:click={() => {handleSession("delete")}}>Delete</button>

</div>
