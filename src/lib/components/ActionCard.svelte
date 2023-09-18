<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let icon: IconDefinition
    export let title = "";
    export let destination = "";
</script>

<a href={destination} class="flex flex-col items-center" title={title}>
    <div class="bg-gray-800 text-white p-4 m-2 rounded-md shadow-md flex flex-col items-center">
        <Fa icon={icon} class="text-3xl" />
    </div>
</a>