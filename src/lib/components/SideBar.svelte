<script lang="ts">
    import {
        faArrowLeft,
        faArrowRight,
    } from "@fortawesome/free-solid-svg-icons";
    import { onMount } from "svelte";

    import Fa from "svelte-fa";
    let is_open = false;

    export let items: {
        name: string;
        route: string;
    }[] = [];

    // Mark the current route as active
    let current_route = "";
    onMount(() => {
        current_route = window.location.pathname;
    });
</script>

{#if is_open}
    <div
        class="flex flex-col items-center h-full fixed left-0 top-0 overflow-auto bg-gray-900 text-white z-50 w-64 border rounded-sm"
        class:sidebar={!is_open}
        style="transform: translateX({is_open ? '0' : '-100%'});"
    >
        <button
            class="mt-2 flex items-center justify-center rounded-full bg-none text-gray-300 hover:text-white font-bold p-2 w-min"
            on:click={() => (is_open = false)}
        >
            <Fa icon={faArrowLeft} />
        </button>

        <div class="px-6 py-4 container w-full">
            <div class="flex flex-col items-center justify-center">
                {#each items as item}
                    <a
                        href={item.route}
                        class="flex items-center justify-center mb-4 bg-none rounded-md text-gray-300 hover:text-white font-semibold p-2 w-full hover:bg-gray-700
                        {current_route === item.route && 'border'}
                        "
                    >
                        {item.name}
                    </a>
                {/each}
            </div>
        </div>
    </div>
{:else}
    <!-- Open sidebar -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="h-full flex items-center w-auto fixed left-0 top-0 overflow-auto bg-transparent text-white z-50"
        on:click={() => (is_open = true)}
    >
        <button
            class="rounded-full bg-none text-gray-300 hover:text-white font-bold p-2 w-auto"
            on:click={() => (is_open = true)}
        >
            <Fa icon={faArrowRight} />
        </button>
    </div>
{/if}

<style>
    .sidebar {
        transition: transform 0.3s ease-out;
    }
</style>
