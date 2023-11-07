<script lang="ts">
	import Fa from "svelte-fa";
	import { faGithub } from "@fortawesome/free-brands-svg-icons";
	import { faCertificate } from "@fortawesome/free-solid-svg-icons";
	import type { PageServerData } from "./$types";
	import { redirect } from "@sveltejs/kit";

	export let data: PageServerData;

	/**
	 * If the user accepts the request, this function will be called
	 * Adds the access to the user
	 * Redirects to callback url with token
	 */
	let redirect_url = data.callback + "?success=true&token=" + data.access_token as string;
</script>

<div class="w-full h-screen flex justify-centera items-center">
	<main
		class="py-4 mx-auto w-10/12 max-w-[66%] flex flex-col items-center justify-center"
	>
		<section class="rounded-md p-4 w-full border">
			<div class="flex justify-center">
				<div class="rounded-full overflow-hidden border-4 border-white">
					<img
						alt="{data.req.username}'s avatar"
						class="w-32 h-32"
						src={data.req.avatar}
					/>
				</div>
			</div>

			<div class="flex flex-col items-center justify-center mt-4">
				<div class="flex flex-row items-center justify-evenly mb-2">
					<h1 class="m-0 text-2xl text-center">
						{data.req.username}
					</h1>

					{#if data.req.verified}
						<i title="Verified">
							<Fa
								class="m-2 text-purple-500"
								icon={faCertificate}
							/>
						</i>
					{/if}
				</div>

				<h3 class="text-center">
					Is requesting your authentication.
				</h3>
				<div
					class="flex flex-row items-center justify-center flex-wrap"
				>
					<span>Wants: </span>{#each data.want as field}
						<span class="m-1 text-white hover:border-b">{field}</span>
					{/each}
				</div>
			</div>

			<div class="flex items-center justify-center mt-4">
				{#if data.logged_in}
					<a href="{redirect_url}">
						<button
							class="w-fit text-white py-2 px-4 rounded"
						>
							Continue as <strong>{data.username}</strong>
						</button>
					</a>
				{:else}
					<a
						href="/join?redirect={encodeURIComponent(data.callback)}&parcial={data.partcial_token}}"
					>
						<button
							class="w-fit text-white font-bold py-2 px-4 rounded"
						>
							Join & Continue
						</button>
					</a>
				{/if}
			</div>


			<!-- decline section -->
			<div class="container mx-auto p-2 flex items-center justify-center mt-2">
				<a
					href="{data.callback}?success=false&error=declined"
				>
					<button
						class="w-fit text-white py-2 px-4 rounded border-red-500"
					>
						Decline Request
					</button>
				</a>
			</div>
		</section>

		<a class="mt-2" href="https://github.com/ezsnova/nova-auth">
			<Fa icon={faGithub} class="text-white text-4xl mt-4" />
		</a>
	</main>
</div>
