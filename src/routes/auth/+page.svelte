<script lang="ts">
	import Fa from "svelte-fa";
	import { faGithub } from "@fortawesome/free-brands-svg-icons";
	import { faCertificate } from "@fortawesome/free-solid-svg-icons";
	import type { PageServerData } from "./$types";

	export let data: PageServerData;

</script>

<div class="w-full h-screen flex justify-centera items-center">
	<main
		class="py-4 mx-auto w-10/12 max-w-[66%] flex flex-col items-center justify-center"
	>
		<div class="rounded-md p-4 w-full border">
			<div class="flex justify-center">
				<div class="rounded-full overflow-hidden border-4 border-white">
					<img
						alt="{data.username}'s avatar"
						class="w-32 h-32"
						src={data.avatar}
					/>
				</div>
			</div>

			<div class="flex flex-col items-center justify-center mt-4">
				<div class="flex flex-row items-center justify-evenly mb-2">
					<h1 class="m-0 text-2xl font-bold text-center">
						{data.username}
					</h1>

					{#if data.verified}
						<i title="Verified">
							<Fa
								class="m-2 text-purple-500"
								icon={faCertificate}
							/>
						</i>
					{/if}
				</div>

				<h3 class="text-center font-bold">It's requesting your authentication </h3>
				<div class="flex flex-row items-center justify-center flex-wrap">
					<span>Wants: </span>{#each data.want as field}
						<span class="m-1 text-white">{field}</span>
					{/each}
				</div>
			</div>

			<div class="flex items-center justify-center mt-4">
			{#if data.logged_in}
				<!-- <a href="{data.callback}">
					<button class="w-fit text-white py-2 px-4 rounded">
						Continue as <strong>{data.auth_username}</strong>
					</button>
				</a> -->
				<button class="w-fit text-white py-2 px-4 rounded"
					on:click={() => {
						window.location.href = data.callback;
					}}
				>
					Continue as <strong>{data.auth_username}</strong>
				</button>


				{:else}
			<a href="/join?callback={data.callback}&want={data.want.join(",")}">
				<button class="w-fit text-white font-bold py-2 px-4 rounded">
					Join
				</button>
			</a>
			{/if}
			</div>
		</div>

		<a href="https://github.com/ezsnova/nova-auth">
			<Fa icon={faGithub} class="text-white text-4xl mt-4" />
		</a>
	</main>
</div>
