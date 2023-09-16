<script>

	import '$lib/css/app.css';
	import '$lib/css/pico.css';

	import { SvelteToast } from '@zerodevx/svelte-toast';

	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	import { BarLoader } from 'svelte-loading-spinners';

	import { beforeNavigate, afterNavigate } from '$app/navigation';

	let isLoading = false;

	beforeNavigate(({ to }) => isLoading = !!to?.route.id)
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
		<SvelteToast />
		<slot />
	</div>
{/key}