<script lang="ts">
    import { faPen } from "@fortawesome/free-solid-svg-icons";
    import type { PageServerData } from "./$types";
    import Fa from "svelte-fa";
    import UsernameInput from "$lib/components/UsernameInput.svelte";
    import { CheckResult } from "$lib/types";
    import { writable } from "svelte/store";

    export let data: PageServerData;

    let editing_username = false;

    let username = "";
    let username_available = writable(CheckResult.empty);


    import { toast } from "@zerodevx/svelte-toast";
    import type { ActionData } from "./$types";
    export let form: ActionData;

    $: {
        if (form) {
            toast.push(form.error as string, {
                theme: {
                    toast: "bg-red-100 text-white",
                    "--toastBackground": "#EF4444",
                    "--toastProgressBackground": "white",
                },
                dismissable: false,
                duration: 3000,
            }); 
        }
    }
</script>

<svelte:head>
    <title>{data.username}</title>
</svelte:head>

<div class="h-screen w-full flex flex-col justify-center items-center">
    <main class="flex flex-col justify-center items-center">
        <div
            class="
            flex
            flex-col
            justify-center
            items-center
            bg-gray-800
            p-5
            text-white
            text-center
            w-72
            min-h-96
            rounded-lg
            shadow-md
            transition-all
            duration-500
            ease-in-out
            "
        >
            <div class="container p-2">
                <img
                    src="{data.avatar}"
                    alt="{data.username}'s profile picture"
                    class="w-30 h-30 rounded-full mb-3"
                />
            </div>

            {#if editing_username}
                <form
                    class="m-0 flex flex-col justify-center items-center"
                    method="post"
                    action="/profile/{data.username}?/update_username"
                >
                    <UsernameInput {username} {username_available} />
                </form>
            {:else}
                <!-- Display name -->

                <!-- Case you can edit and want to show edit button-->
                {#if data.owner && data.show_edit}
                    <div
                        class="w-full flex flex-row justify-between items-center"
                    >
                        <h3 class="text-2xl font-bold mb-2">
                            {data.username}
                        </h3>

                        <!-- Edit diplay name-->
                        <button
                            class="no-bg w-min text-gray-400 border-gray-400 hover:text-white hover:border-white transition-all duration-200 ease-in-out"
                            title="Edit display name"
                            on:click={() => (editing_username = true)}
                        >
                            <Fa icon={faPen} />
                        </button>
                    </div>
                    <!-- Case you can edit but don't want to show edit button or you can't edit-->
                {:else}
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <h3
                        class="m-0 text-2xl font-bold mb-2"
                        on:click={() => {
                            if (data.owner) {
                                editing_username = true;
                            }
                        }}
                    >
                        {data.username}
                    </h3>
                {/if}
            {/if}
        </div>
    </main>
</div>

<style>
    .no-bg {
        background: none;
    }
</style>
