<head>
	<title>NoVa Auth</title>
</head>


<div class="flex flex-col justify-center items-center h-screen">
	<main>
		<h1 class="text-4xl font-bold text-center"><span class="blink p-1">NoVa</span> Auth</h1>
		<p class="m-3 text-center">A simple authentication system.</p>

        <div class="border rounded-sm flex flex-row justify-evenly items-center w-full p-2">
            <div title="Create an account or log in"  class="w-1/3 justify-center items-center">
				<a href="/join"><p class="m-0 text-center text-white hover:bg-white hover:text-slate-950">Join</p></a>
            </div>

            <span class="font-bold select-none"> | </span>

            <div title="Start using NoVa Auth Service" class="w-1/3 justify-center items-center">
				<a href="/use"><p class="m-0 text-center text-white hover:bg-white hover:text-slate-950">Use</p></a>
            </div>
        </div>
    </main>
</div>

<footer class="absolute w-full text-center">
	<p class="text-sm text-gray-500">
		Made with <span class="text-red-500">&hearts;</span> by
		<a href="https://github.com/ezsnova/">NoVa</a>
	</p>
</footer>

<style>
	.blink {
		animation: blinker 2.5s cubic-bezier(0.755, 0.05, 0.855, 0.06) infinite;
	}
	@keyframes blinker {
		50% {
			opacity: 0;
			border-bottom: 2px solid #7d1fc2;
		}
	}
</style>
