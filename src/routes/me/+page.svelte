<script lang="ts">
    import ActionCard from "$lib/components/ActionCard.svelte";
    import {
        faEye,
        faGear,
        faUserEdit,
    } from "@fortawesome/free-solid-svg-icons";
    import type { PageServerData } from "./$types";
    import { redirect } from "@sveltejs/kit";
    import { handle } from "../../hooks.server";

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

    function handleAPi(route: string, action: string) {
        fetch("/api/" + route, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: action,
            }),
        }).then(() => {
            // TODO: Show the key 
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


    <section class="container flex flex-col justify-center items-center">
        <h2 class="text-2xl mb-4">API</h2>
        <p class="text-center">
            Manage your API keys here. 
        </p>

        <section class="container flex flex-col justify-center items-center">
            <h4>Generate API Key</h4>
            
            <button
                class="w-auto m-2 p-2 bg-green-500 rounded-md text-white"
                on:click={() => {
                    handleAPi("key", "generate");
                }}>Generate</button
        </section>
        
    </section>


    <section class="container flex flex-col justify-center items-center">
        <h2 class="text-2xl mb-4">Danger Zone</h2>
        <p class="text-center">
            These actions are irreversible. Please be careful.
        </p>

        <div class="flex">
        <button
            class="w-auto m-2 p-2 bg-red-500 rounded-md text-white"
            on:click={() => {
                handleSession("logout");
            }}>Logout</button
        >
        <button
            class="w-auto m-2 p-2 bg-red-500 rounded-md text-white"
            on:click={() => {
                handleSession("delete");
            }}>Delete</button
        >
        </div>
    </section>
</div>
