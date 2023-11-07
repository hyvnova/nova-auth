<script lang="ts">
    import ActionCard from "$lib/components/ActionCard.svelte";
    import {
        faEye,
        faGear,
        faRepeat,
        faUserEdit,
    } from "@fortawesome/free-solid-svg-icons";
    import type { PageServerData } from "./$types";
    import { writable, type Writable } from "svelte/store";
    import Fa from "svelte-fa";

    export let data: PageServerData;

    function handle_session(action: string) {
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

    async function generate_key() {
        let res = await fetch("/api/key", {
            method: "GET",
        });

        let json = await res.json();
        $key = json.key;
    }

    let key: Writable<string> = writable(data.key);
    let show_key: Writable<boolean> = writable(false);
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
            <ActionCard icon={faGear} title="Settings" destination="/me" />
        </div>
    </header>

    <section class="container flex flex-col justify-center items-center">
        <h2 class="text-2xl mb-4">API</h2>
        <p class="text-center">Keep your API key secret!</p>

        <section
            class="pt-4 container flex flex-col justify-center items-center"
        >
            <div
                class="flex justify-center items-center border rounded-md w-auto p-1"
                title="API Key"
            >
                <!-- regnerate key -->
                <button
                    class="p-2 w-auto flex justify-center items-center"
                    title="Regenerate Key"
                    on:click={async () => {
                        await generate_key();
                    }}
                >
                    <Fa icon={faRepeat} class="" />
                </button>

                <p class="mx-2 text-bold text-center">
                    {#if $show_key}
                        {$key}
                    {:else}
                        ******** ******** ******** ********
                    {/if}
                </p>

                <!-- show key-->
                <button
                    class="p-2 w-auto flex justify-center items-center"
                    title="Show Key"
                    on:click={() => {
                        $show_key = !$show_key;
                    }}
                >
                    <Fa icon={faEye} />
                </button>
            </div>
        </section>
    </section>

    <section class="container flex flex-col justify-center items-center">
        <h2 class="text-2xl mb-4">Danger Zone</h2>
        <p class="text-center">These actions are irreversible. Be careful.</p>

        <div class="flex">
            <button
                class="w-auto m-2 p-2 bg-red-500 rounded-md text-white"
                on:click={() => {
                    handle_session("logout");
                }}>Logout</button
            >
            <button
                class="w-auto m-2 p-2 bg-red-500 rounded-md text-white"
                on:click={() => {
                    handle_session("delete");
                }}>Delete</button
            >
        </div>
    </section>
</div>
