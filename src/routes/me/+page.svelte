<script lang="ts">
  import ActionCard from "$lib/components/ActionCard.svelte";
  import {
    faEye,
    faGear,
    faRepeat,
    faTrash,
    faUserEdit,
  } from "@fortawesome/free-solid-svg-icons";
  import type { PageServerData } from "./$types";
  import { writable, type Writable } from "svelte/store";
  import Fa from "svelte-fa";
  import Toast from "$lib/components/Toast.svelte";
  import toast from "$lib/stores/toast";

  export let data: PageServerData;
  let trusted_domains = writable(data.trusted_domains);

  function handle_session(action: string) {
    fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: action,
      }),
    }).then(() => {
      window.location.href = "/";
    });
  }

  async function generate_key() {
    let res = await fetch("/api/key", {
      method: "GET",
    });

    let json = await res.json();
    $key = json.key;
  }

  let key: Writable<string> = writable(data.key);

  let domain_input_value: string;

  async function update_trusted_domains(action: "add" | "remove", domain: string) {
    let res = await fetch("/api/user/trusted_domains", {
      method: "POST",
      body: JSON.stringify({
        domain,
        action,
      }),
    });

    if (res.status != 200) {
      let json = await res.json();
      toast.set({
        type: "error",
        title: "How dare you!",
        message: json.error,
        duration: 3000,
      })
      return;
    }

    if (action === "add") {
      trusted_domains.update((domains) => [...domains, domain]);
      domain_input_value = "";
    } else {
      trusted_domains.update((domains) =>
        domains.filter((dx) => dx !== domain)
      );
    }
  }
</script>

<div class="h-screen flex flex-col items-center">
  <Toast />

  <header class="pt-4 flex flex-col items-center">
    <h2 class="text-2xl mb-4">Quick Actions</h2>
    <div class="flex flex-wrap justify-center">
      <ActionCard
        icon={faUserEdit}
        title="Edit Profile"
        destination="/profile/{data.username}?show_edit=true"
      />
      <ActionCard icon={faGear} title="Settings" destination="/me" />
    </div>
  </header>

  <section class="mt-10 container flex flex-col justify-center items-center">
    <h2 class="text-2xl mb-4">API</h2>
    <p class="text-center max-w-md">
      Below is you <b>API KEY</b>. Used for making authentication requests as
      you, in simple, <b>it is an ID</b>. Although, it will only work if the
      "callback" parameter is allowed in the
      <a href="#allowed-domains"><u>Allowed Domains</u></a> section.
    </p>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="flex justify-center items-center border rounded-md w-auto p-1 my-2"
      title="API Key"
      on:click={() => {
        // Copy to clipboard
        navigator.clipboard.writeText($key);
        alert("API Key copied to clipboard");
      }}
    >
      <!-- regnerate key -->
      <button
        class="p-2 w-auto flex justify-center items-center"
        title="Regenerate Key"
        on:click={async () => {
          await generate_key();
        }}
      >
        <Fa icon={faRepeat} class="" />
      </button>

      <p class="mx-2 text-bold text-center">
        {$key}
      </p>
    </div>

    <section
      class="mt-10 container flex flex-col justify-center items-center"
      id="allowed-domains"
    >
      <h2 class="text-2xl mb-4">Allowed Domains</h2>
      <p class="text-center max-w-md my-2">
        Below are the domains that are allowed to use your API key. Without
        these domains, your API key will not work. Make sure to <b
          >only allow domains that you trust.</b
        >
      </p>

      <div class="flex flex-col justify-center items-center my-4">
        <form
          class="flex flex-row"
          on:submit={async () => {
            await update_trusted_domains("add", domain_input_value);
          }}
        >
          <div class="flex flex-row">
            <input
              type="text"
              name="domain"
              class="border rounded-md p-2 w-full h-full"
              placeholder="https://example.com"
              pattern="http[s]?://.*"
              bind:value={domain_input_value}
            />
            <button
              class="border-blue-500 text-white p-2 rounded-sm w-1/3 h-12
                            hover:bg-blue-500 hover:text-white"
              type="submit">Trust</button
            >
          </div>
        </form>

        {#each $trusted_domains as domain}
          <div
            class="flex justify-between items-center w-full p-2 border rounded-md my-2"
          >
            <p>{domain}</p>
            <button
              class="p-2 border-white rounded-md text-white w-min hover:border-red-500 hover:text-red-500"
              on:click={async () => {
                await update_trusted_domains("remove", domain);
              }}
            >
              <Fa
                icon={faTrash}
                class="cursor-pointe" 
              ></Fa>
            </button>
          </div>
        {/each}
      </div>
      <section />

      <section class="container flex flex-col justify-center items-center">
        <h2 class="text-2xl mb-4">Danger Zone</h2>
        <p class="text-center">These actions are irreversible. Be careful.</p>

        <div class="flex">
          <button
            class="w-auto m-2 p-2 bg-red-500 rounded-md text-white"
            on:click={() => {
              handle_session("logout");
            }}>Logout</button
          >
          <button
            class="w-auto m-2 p-2 bg-red-500 rounded-md text-white"
            on:click={() => {
              handle_session("delete");
            }}>Delete</button
          >
        </div>
      </section>
    </section>
  </section>
</div>
