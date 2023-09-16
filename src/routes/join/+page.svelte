<script lang="ts">
  import type { ActionData } from "./$types";
  import { CheckResult } from "$lib/types";
  import { toast } from '@zerodevx/svelte-toast';

  let username = "";
  let username_available: CheckResult = CheckResult.empty;

  async function check_availability(
    type: string,
    value: string
  ): Promise<CheckResult> {
    if (!value) return CheckResult.empty

    let availability = await fetch("/api/check_availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, value }),
      // @ts-ignore
    }).then((res) => res.json());

    return availability.result as CheckResult;
  }

  $: {
    if (username) {
      check_availability("username", username).then((res) => {
        username_available = res;
      });
    } else {
      username_available = CheckResult.empty;
    }
  }

  let email = "";
  let email_available: CheckResult = CheckResult.empty;

  // Reactive statement that watches for changes in the email variable
  $: {
    if (email) {
      check_availability("email", email).then((res) => {
        email_available = res;
      });
    } else {
      email_available = CheckResult.empty;
    }
  }

  // Results of the form submission
  export let form: ActionData;

  $: if (form) {
		// if form exists, it means that it failed to join a gallery
		toast.push(form.error as string, {
			theme: {
				toast: 'bg-red-100 text-white',
				'--toastBackground': '#EF4444',
				'--toastProgressBackground': 'white'
			},
			dismissable: false,
			duration: 3000
		});
	}
</script>

<!-- If form submission had an error -->

<div class="flex flex-col justify-center items-center h-screen">
  <main
    class="slide-up m-1 bg-[rgba(180,180,180,0.1)] backdrop-blur-md rounded-xl p-6 shadow-xl"
  >
    <form
      class="p-1 flex flex-col items-center justify-center transition-all duration-500 ease-in-out"
      method="post"
      action="/join"
    >
      <div class="flex flex-col items-center justify-center">
        <h1 class="m-1 text-4xl font-bold">Account</h1>
        <p>
          Enter you credentials to <strong>Log In</strong> or
          <strong>Sign Up</strong>
        </p>
      </div>

      <div class="flex flex-col items-center justify-center w-full">
        <input
          required
          name="username"
          type="text"
          title="
          {username_available === CheckResult.empty ?  "Username should be alphanumeric including '.' and '_' and under 25 characters." : ''}
          {username_available === CheckResult.available ? 'Username is available' : ''}
          {username_available === CheckResult.taken ? 'This is username is taken, if it yours enter you password to log in' : ''}
          {username_available === CheckResult.invalid ? 'Username should be alphanumeric including "." and "_" and under 25 characters.' : ''}
          "
          placeholder="Username"
          class="rounded-lg
          {username_available === CheckResult.available ? 'border-green-500' : ''}
          {username_available === CheckResult.taken ? 'border-blue-500' : ''}
          {username_available === CheckResult.invalid ? 'border-red-500' : ''}
          "
          bind:value={username}
        />
      </div>

      <!-- If username available, ask for email and password since were creating an account-->
      {#if username_available === CheckResult.available}
        <input
          required
          name="email"
          type="email"
          placeholder="Email"
          bind:value={email}
          class="rounded-lg
          {email_available === CheckResult.available ? 'border-green-500' : ''}
          {email_available === CheckResult.taken ? 'border-yellow-500' : ''}
          {email_available === CheckResult.invalid ? 'border-red-500' : ''}
          "
          title="
          {email_available === CheckResult.empty ?  "Email should be a valid email address." : ''}
          {email_available === CheckResult.available ? 'Email is available' : ''}
          {email_available === CheckResult.taken ? 'This email is being used by another account' : ''}
          {email_available === CheckResult.invalid ? 'Email should be a valid email address.' : ''}
          "
        />

        {#if email_available === CheckResult.available}
          <input
            required
            name="password"
            type="password"
            placeholder="Password"
            class="rounded-lg"
            title="Password can be whatever you want, becareful. We recommend at least 8 characters, 1 uppercase, 1 lowercase, and 1 number"
          />
          <button type="submit" class="m-1 p-1 border">Sign Up</button>
        {/if}

        <!-- If username not available, ask for password since were logging in-->
      {:else if username_available === CheckResult.taken}
        <input
          required
          name="password"
          type="password"
          placeholder="Password"
          class="rounded-lg"
        />
        <button type="submit" class="m-1 p-1 border">Log In</button>
      {/if}
    </form>
  </main>
</div>

<style>
  .slide-up {
    animation: slide-up 1s ease-out forwards;
  }
  @keyframes slide-up {
    0% {
      transform: translateY(100%); /* Start from the bottom */
      opacity: 0;
    }
    100% {
      transform: translateY(0); /* End at the top */
      opacity: 1;
    }
  }
</style>
