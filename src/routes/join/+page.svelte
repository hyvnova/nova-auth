<script lang="ts">
  import type { ActionData } from "./$types";
  import { CheckResult } from "$lib/types";
  import { toast } from "@zerodevx/svelte-toast";
  import UsernameInput from "$lib/components/UsernameInput.svelte";
  import EmailInput from "$lib/components/EmailInput.svelte";
    import { writable } from "svelte/store";

  let username = "";
  let username_available = writable(CheckResult.empty);

  let email = "";
  let email_available = writable(CheckResult.empty);

  // Results of the form submission
  export let form: ActionData;

  $: if (form) {
    // if form exists, it means that it failed to join a gallery
    toast.push(form.error as string, {
      theme: {
        toast: "bg-red-100 text-white",
        "--toastBackground": "#EF4444",
        "--toastProgressBackground": "white",
      },
      dismissable: false,
      duration: 3000,
    });
  }
</script>

<!-- If form submission had an error -->

<div class="flex flex-col justify-center items-center h-screen">
  <main class="slide-up m-1 border backdrop-blur-md rounded-md p-6 shadow-xl">
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
        <UsernameInput {username} {username_available} />
      </div>

      <!-- If username available, ask for email and password since were creating an account-->
      {#if $username_available === CheckResult.available}
        <EmailInput {email} {email_available} />

        {#if $email_available === CheckResult.available}
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
      {:else if $username_available === CheckResult.taken}
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
