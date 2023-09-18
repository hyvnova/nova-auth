<!-- BottomToolbar.svelte -->
<script>
    import {
        faHome,
        faUser,
        faSearch,
    } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import SearchModal from "./SearchModal.svelte";
    import { writable } from "svelte/store";

    let search_modal_open = writable(false);


    

</script>

<footer
    class="container fixed bottom-0 w-full bg-gray-800 p-2 self-center rounded-lg"
>
    <SearchModal modal_open={search_modal_open} />

    <div class="flex justify-around items-center">
        <div class="p-1 hover:scale-110 hover:text-white" title="Home">
            <a href="/">
                <Fa icon={faHome} class="text-2xl" />
            </a>
        </div>
        <div class="p-1 hover:scale-110 hover:text-white" title="Me">
            <a href="/me">
                <Fa icon={faUser} class="text-2xl" />
            </a>
        </div>
        <div class="p-1 hover:scale-110 hover:text-white" title="Search">
            <button on:click={() => (search_modal_open.set(true))} class="border-none">
                <Fa icon={faSearch} class="text-2xl" />
            </button>
        </div>
    </div>
</footer>
