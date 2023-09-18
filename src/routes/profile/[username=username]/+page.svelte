<script lang="ts">
    import { faPen } from "@fortawesome/free-solid-svg-icons";
    import type { PageServerData } from "./$types";
    import Fa from "svelte-fa";
    import UsernameInput from "$lib/components/UsernameInput.svelte";
    import { CheckResult } from "$lib/types";
    import { writable } from "svelte/store";
    import { toast } from "@zerodevx/svelte-toast";

    export let data: PageServerData;

    let editing_username = false;
    let editing_avatar = false;

    let username = "";
    let username_available = writable(CheckResult.empty);

    import type { ActionData } from "./$types";
    import { onMount } from "svelte";
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

    // When "esc" is pressed, stop editing
    onMount(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                editing_username = false;
                editing_avatar = false;
            }
        });
    });
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
            rounded-md
            shadow-md
            transition-all
            duration-500
            ease-in-out
            "
        >
            <div class="container p-2">
                <!-- Profile avatar -->

                {#if editing_avatar}
                    <form
                        class="m-0 flex flex-col justify-center items-center"
                        method="post"
                        action="/profile/{data.username}?/update_avatar"
                    >
                        <input
                            type="url"
                            name="avatar"
                            placeholder="Profile avatar URL"
                            class="w-full p-2 rounded-md border-gray-400 border-2 mb-2"
                        />
                    </form>
                {:else}
                    <!-- Case you can edit and want to show edit button-->
                    {#if data.owner && data.show_edit}
                        <button
                            class="rounded-full no-bg w-min p-2 text-gray-400 border-gray-400 hover:text-white hover:border-white transition-all duration-200 ease-in-out"
                            title="Edit profile avatar"
                            on:click={() => (editing_avatar = true)}
                        >
                            <Fa icon={faPen} />
                        </button>

                        <img
                            class="w-30 h-30 rounded-full"
                            src={data.avatar}
                            alt="{data.username}'s profile avatar"
                        />

                        <!-- Case you can edit but don't want to show edit button or you can't edit-->
                    {:else}
                        <button
                            class="
                            mb-3 rounded-full border-white border-0
                            transition-all duration-200 ease-in-out
                            hover:border-2 hover:scale-105
                            "
                            title="Click to edit profile avatar"
                            on:click={() => {
                                if (data.owner) {
                                    editing_avatar = true;
                                }
                            }}
                        >
                            <img
                                class="
                                w-30 h-30 rounded-full"
                                src={data.avatar}
                                alt="{data.username}'s profile avatar"
                            />
                        </button>
                    {/if}
                {/if}
            </div>

            <!-- Username -->

            {#if editing_username}
                <form
                    class="m-0 flex flex-col justify-center items-center"
                    method="post"
                    action="/profile/{data.username}?/update_username"
                >
                    <UsernameInput {username} {username_available} />
                </form>
            {:else}
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
                            class="rounded-full w-min p-2 text-gray-400 border-gray-400 hover:text-white hover:border-white transition-all duration-200 ease-in-out"
                            title="Edit username"
                            on:click={() => (editing_username = true)}
                        >
                            <Fa icon={faPen} />
                        </button>
                    </div>
                    <!-- Case you can edit but don't want to show edit button or you can't edit-->
                {:else}
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <button
                        class="
                        w-full border-0 border-white
                        transition-all duration-200 ease-in-out
                        hover:border hover:scale-105
                        "
                        title="Click to edit username"
                        on:click={() => {
                            if (data.owner) {
                                editing_username = true;
                            }
                        }}
                    >
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
                    </button>
                {/if}
            {/if}
        </div>
    </main>
</div>
