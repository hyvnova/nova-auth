<script lang="ts">
	import { page } from '$app/stores';
    import ActionCard from '$lib/components/ActionCard.svelte';
    import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
</script>

<svelte:head>
	<title>Error: {$page.error?.message}</title>
</svelte:head>


<div class="flex flex-col justify-center items-center h-screen">
	<main class="flex flex-col items-center justify-center">	
		<h1 class="m-1">{$page.error?.message}</h1>

        <div class="flex container h-auto justify-center items-center w-10/12 mt-4">
			<ActionCard
				title="Home"
				icon={faHome}
				destination="/"
			/>

			<ActionCard
				title="My Account"
				icon={faUser}
				destination="/me"
			/>
		</div>
	</main>
</div>