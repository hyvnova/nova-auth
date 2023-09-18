<script lang="ts">
    import { faTimes } from '@fortawesome/free-solid-svg-icons';
    import { onMount } from 'svelte';
    import Fa from 'svelte-fa';
    import type { Writable } from 'svelte/store';

    export let modal_open: Writable<boolean>;

    let query = '';
    let results: string[] = [];

    // This function should be replaced with actual search logic
    async function search() {
        // Simulate a search
        results = ['Result 1', 'Result 2', 'Result 3'];
    }


    // When "esc" is pressed close the search modal
    onMount(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                modal_open.set(false);
            }
        });
    });
</script>

{#if $modal_open}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="fixed inset-0 z-10 overflow-auto bg-black bg-opacity-40"
    >
        <div class="absolute top-3 left-1/2 transform -translate-x-1/2 mt-2">
            <button class="border-white text-white rounded-full p-2 hover:bg-slate-600" on:click={() => modal_open.set(false)}>
                <Fa icon={faTimes} />
            </button>
        </div>
        

        <div class="bg-gray-800 m-auto mt-24 p-5 rounded-md border border-gray-700 w-4/5 ">
            <div class="mb-5">
                <input type="text" bind:value={query} placeholder="Search for some user" on:input={search} class="w-full p-2 border-white">
            </div>
            <div class="container flex flex-col">
                <ol>
                    {#each results as result (result)}
                        <li class="
                        text-white p-2 bg-slate-800 
                        transition-all duration-300 ease-in-out
                        hover:scale-105 hover:bg-slate-600
                        "
                        >{result}</li>
                    {/each}
                </ol>
            </div>
        </div>
    </div>
{/if}
