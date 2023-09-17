<script lang="ts">
	import { CheckResult } from "$lib/types";
	import check_availability from "$lib/utils/check_availability";
    import type { Writable } from "svelte/store";

	export let username: string;
	export let username_available: Writable<CheckResult>;

	$: {
		if (username) {
			check_availability("username", username).then((res) => {
				username_available.set(res);
			});
		} else {
			username_available.set(CheckResult.empty);
		}
	}
</script>

<input
	required
	name="username"
	type="text"
	title="
          {$username_available === CheckResult.empty
		? "Username should be alphanumeric in lowercase, might inclde '_' and should be under 25 characters."
		: ''}
          {$username_available === CheckResult.available
		? 'Username is available'
		: ''}
          {$username_available === CheckResult.taken
		? 'This is username is taken, perhaps by you?'
		: ''}
          {$username_available === CheckResult.invalid
		? "Username should be alphanumeric in lowercase, might inclde '_' and should be under 25 characters."
		: ''}
          "
	placeholder="Username"
	class="rounded-lg
          {$username_available === CheckResult.available
		? 'border-green-500'
		: ''}
          {$username_available === CheckResult.taken ? 'border-blue-500' : ''}
          {$username_available === CheckResult.invalid ? 'border-red-500' : ''}
          "
	bind:value={username}
/>
