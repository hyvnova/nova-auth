<script>
    import SideBar from "$lib/components/SideBar.svelte";

</script>


<!-- Sidebar -->
<aside>
    <SideBar items={[
        { name: "Quick Start", route: "/use" },
        { name: "Example", route: "/"},
        { name: "Example", route: "/"}
    ]}/>
</aside>
<main>
    <slot />
</main>