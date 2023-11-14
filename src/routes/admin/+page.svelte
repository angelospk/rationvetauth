<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import LoadingCircles from '$lib/Loading Circles.svelte';
	import SignInFacebook from '$lib/SignInFacebook.svelte';
	import SignInGoogle from '$lib/SignInGoogle.svelte';
	import { pb } from '$lib/pocketbase';
	import { userFeeds } from '$lib/stores/data';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 3000
	};
	let formData: FormData;
	let username: String;
	let password: String;
	// export let data:PageData
	let text = 'loading';
	let loading = false;
	let showVerification = false;
	let emailVerif = '';
	async function sendVerif() {
		await pb.collection('users').requestVerification(emailVerif);
		te.message = 'Στάλθηκε email επιβεβαίωσης. Δες σε λίγο τα εισερχόμενά σου';
		toastStore.trigger(te);
	}

	export let cl: string = '';
	onMount(async () => {
		if (pb.authStore.isAdmin) goto('/admin/dashboard');
		pb.authStore.clear();
		pb.admins.authRefresh();
	});
</script>

<!-- {JSON.stringify(pb.authStore.isAdmin)} -->
<div class="flex-col p-6">
	<div class="text-center">
		<p class="mt-3 text-white text-3xl dark:text-white">Σύνδεση Διαχειριστή</p>
	</div>

	<div class="mt-8 max-w-lg mx-auto">
		<form
			method="POST"
			action="?/login"
			use:enhance={({ formElement, formData, action, cancel }) => {
				loading = true;
				text = 'loading...';
				return async ({ result }) => {
					// `result` is an `ActionResult` object
					loading = false;
					console.log(result);

					// console.log(form);
					if ((result.status = 200 && result?.data?.admin)) {
						let d = pb.authStore.loadFromCookie(result.data.st);
						try {
							// get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
							pb.authStore.isValid && (await invalidateAll());
						} catch (_) {
							// clear the auth store on failed refresh
							pb.authStore.clear();
						}
						te.message = 'Επιτυχής είσοδος!';
						te.background = 'bg-green-600';
						toastStore.trigger(te);
						goto('/admin/dashboard');
					} else {
						// console.log(e);
						text = 'Δεν μπόρεσε να πραγματοποιηθεί είσοδος.';
						te.background = 'bg-red-500';
						te.message = text;
						toastStore.trigger(te);
						// loading=true
					}
				};
			}}
		>
			<!-- <form> -->
			<div>
				<label for="email" class="block mb-2 text-xl text-white dark:text-white text-left"
					>Email</label
				>
				<input
					type="email"
					bind:value={username}
					name="email"
					id="email"
					placeholder="example@example.com"
					class="block w-full px-4 py-2 mt-2 text-white placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
				/>
			</div>

			<div class="mt-6">
				<div class="flex justify-between mb-2">
					<label for="password" class="text-xl text-white dark:text-white">Κωδικός</label>
				</div>

				<input
					type="password"
					bind:value={password}
					name="password"
					id="password"
					placeholder="Κωδικός"
					class="block w-full px-4 py-2 mt-2 text-white placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
				/>
			</div>

			<div class="mt-6">
				<!-- <button on:click={login} -->
				{#if loading}
					<LoadingCircles />
				{:else}
					<button
						class="w-full px-4 py-2 text-xl hover:underline tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
					>
						Είσοδος Διαχειριστή
					</button>
				{/if}
			</div>
		</form>
	</div>
</div>
