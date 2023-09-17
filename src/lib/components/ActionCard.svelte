<script lang="ts">
    import Fa from "svelte-fa";
    import type { IconDefinition } from "@fortawesome/free-brands-svg-icons";

    export let icon: IconDefinition;
    export let title: string;
    export let destination: string;
</script>

<a href={destination}>
<div
    class="glass px-2 py-6 max-w-xl w-40 mx-1 min-h-max rounded-lg flex flex-col items-center cursor-pointer
    hover:scale-105 transition-all duration-200 ease-in-out
    shadow-lg
    "
>
    <div class="flex justify-center items-center px-2 py-4 rounded-2xl">
        <Fa {icon} class="lg:text-5xl text-3xl sm:text-1lg text-white" />
    </div>
    <h3 class="mb-1 text-lg sm:text-sm md:text-base font-medium text-white">
        {title}
    </h3>
</div>
</a>

<style>
    .glass {
        background: rgba(75, 75, 75, 0.05);
        backdrop-filter: blur(3.5px);
        -webkit-backdrop-filter: blur(3.5px);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.384);
    }
</style>
