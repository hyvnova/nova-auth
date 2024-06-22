<script>
	import "@picocss/pico/css/pico.min.css";
	import "./../app.css";

	import { fly } from "svelte/transition";
	import { cubicIn, cubicOut } from "svelte/easing";

	import { BarLoader } from "svelte-loading-spinners";

	import { beforeNavigate, afterNavigate } from "$app/navigation";

	let isLoading = false;

	beforeNavigate(({ to }) => (isLoading = !!to?.route.id));
	afterNavigate(() => (isLoading = false));

	export let data;

	const duration = 300;
	const delay = duration + 100;
	const y = 10;

	const transitionIn = { easing: cubicOut, y, duration, delay };
	const transitionOut = { easing: cubicIn, y: -y, duration };
</script>


{#if isLoading}
	<BarLoader />
{/if}

{#key data.pathname}
	<div in:fly={transitionIn} out:fly={transitionOut}>
		<slot />
	</div>
{/key}
