<script lang="ts">
	import { CheckResult } from "$lib/types";
	import check_availability from "$lib/utils/check_availability";
    import type { Writable } from "svelte/store";

	export let email = "";
	export let email_available: Writable<CheckResult>;

	$: {
		if (email) {
			check_availability("email", email).then((res) => {
				email_available.set(res);
			});
		} else {
			email_available.set(CheckResult.empty);
		}
	}
</script>

<input
	required
	name="email"
	type="email"
	placeholder="Email"
	bind:value={email}
	class="rounded-lg
          {$email_available === CheckResult.available ? 'border-green-500' : ''}
          {$email_available === CheckResult.taken ? 'border-yellow-500' : ''}
          {$email_available === CheckResult.invalid ? 'border-red-500' : ''}
          "
	title="
          {$email_available === CheckResult.empty
		? 'Email should be a valid email address.'
		: ''}
          {$email_available === CheckResult.available
		? 'Email is available'
		: ''}
          {$email_available === CheckResult.taken
		? 'This email is being used by another account'
		: ''}
          {$email_available === CheckResult.invalid
		? 'Email should be a valid email address.'
		: ''}
          "
/>
