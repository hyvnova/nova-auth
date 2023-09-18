<script lang="ts">
    import ActionCard from "$lib/components/ActionCard.svelte";
    import {
        faEye,
        faGear,
        faUserEdit,
    } from "@fortawesome/free-solid-svg-icons";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;
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
            <ActionCard
                icon={faGear}
                title="Settings"
                destination="/settings"
            />
            <ActionCard icon={faEye} title="View Data" destination="/data" />
        </div>
    </header>
</div>
