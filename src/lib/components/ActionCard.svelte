<script lang="ts">
    import Fa from "svelte-fa";
    import type { IconDefinition } from "@fortawesome/free-brands-svg-icons";

    export let icon: IconDefinition;
    export let title: string;
    export let destination: string;
</script>

<div
    class="glass px-2 py-6 max-w-xl mx-au min-h-max rounded-lg flex flex-col items-center cursor-pointer
    hover:scale-105 transition-all duration-200 ease-in-out
    "
>
    <div class="flex justify-center items-center p-4 rounded-2xl">
        <Fa icon={icon} class="text-5xl text-white" />
    </div>
    <h3 class="m-1 text-lg font-medium text-white">{title}</h3>
</div>

<style>
    .glass {
        background: rgba(253, 253, 253, 0.05);
        box-shadow: 0 8px 32px 0 rgba(60, 68, 168, 0.37);
        backdrop-filter: blur(3.5px);
        -webkit-backdrop-filter: blur(3.5px);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.384);
    }
</style>
