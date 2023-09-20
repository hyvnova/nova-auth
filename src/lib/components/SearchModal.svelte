<script lang="ts">
    import { faTimes } from "@fortawesome/free-solid-svg-icons";
    import { onMount } from "svelte";
    import Fa from "svelte-fa";
    import { writable, type Writable } from "svelte/store";

    enum StateType {
        idle,
        searching,
    }

    type ResultType = {
        username: string;
        avatar: string;
    };

    export let modal_open: Writable<boolean>;

    let query = "";
    let results: Writable<ResultType[]> = writable([]);

    let state: Writable<StateType> = writable(StateType.idle);

    // This function should be replaced with actual search logic
    async function search() {
        state.set(StateType.searching);

        // Make a request to /api/search
        fetch("/api/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                results.set(data.results);
                state.set(StateType.idle);
            });
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
    <div class="fixed inset-0 z-10 overflow-auto bg-black bg-opacity-40">
        <div class="absolute top-3 left-1/2 transform -translate-x-1/2 mt-2">
            <button
                class="border-white text-white rounded-full p-2 hover:bg-slate-600"
                on:click={() => modal_open.set(false)}
            >
                <Fa icon={faTimes} />
            </button>
        </div>

        <div
            class="bg-gray-800 m-auto mt-24 p-5 rounded-md border border-gray-700 w-4/5"
        >
            <div class="mb-5">
                <!-- svelte-ignore a11y-autofocus -->
                <input
                    autofocus
                    type="text"
                    bind:value={query}
                    placeholder="Search for some user"
                    on:input={search}
                    on:change={search}
                    class="
                    w-full p-2 border-white outline-none rounded-md max-h-max
                    {$state === StateType.searching ? 'cursor-wait' : ''}
                    "
                />
            </div>
            <div class="container flex flex-col">
                <ol>
                    <!-- If there are no resuls -->
                    {#if !$results}
                        <p class="text-gray-400">Nothing here...</p>
                    {:else}
                        {#each $results as result (result)}
                            <a href="/profile/{result.username}">
                                <div
                                    class="
                                    flex items-center mb-2 p-2 rounded-md
                                    hover:bg-gray-700
                                    "
                                >
                                    <img
                                        src={result.avatar}
                                        alt="avatar"
                                        class="w-10 h-10 rounded-full"
                                    />
                                    <a
                                        href="/profile/{result.username}"
                                        class="ml-2">{result.username}</a
                                    >
                                </div>
                            </a>
                        {/each}
                    {/if}
                </ol>
            </div>
        </div>
    </div>
{/if}
