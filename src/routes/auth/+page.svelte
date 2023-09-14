<script>
	import Fa from 'svelte-fa';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { faCertificate } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="w-full h-screen flex justify-centera items-center">
	<main class="py-4 mx-auto w-10/12 max-w-[66%] flex flex-col items-center justify-center">
		<div class="glass-card p-4 w-full">
			<div class="flex justify-center">
				<div class="rounded-full overflow-hidden border-4 border-white">
					<img
						alt="Nova Auth logo"
						class="w-32 h-32"
						src="https://avatars.githubusercontent.com/u/25180623?v=4"
					/>
				</div>
			</div>

			<div class="flex flex-col items-center justify-center mt-4">
				<div class="flex flex-row items-center justify-evenly">
					<h1 class="m-0 text-2xl font-bold text-center">NoVa Auth</h1>

					<i title="Verified">
						<Fa class="m-2 text-purple-500" icon={faCertificate} />
					</i>
				</div>
				<p class="text-center">A simple authentication system.</p>
			</div>
		</div>

		<a href="https://github.com/ezsnova/nova-auth">
			<Fa icon={faGithub} class="text-white text-4xl mt-4" />
		</a>
	</main>
</div>

<style>
	.glass-card {
		background: rgba(125, 31, 194, 0.15);
		box-shadow: 0 rgba(129, 52, 185, 0.15);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		border-radius: 10px;
	}
</style>
