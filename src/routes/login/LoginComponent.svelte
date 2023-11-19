<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { currentUser, pb } from '$lib/pocketbase';
	import { userFeeds, userRations } from '$lib/stores/data.js';
	import SignInGoogle from '$lib/SignInGoogle.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import LoadingCircles from '$lib/Loading Circles.svelte';
	import SignInFacebook from '$lib/SignInFacebook.svelte';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 3000
	};
	let formData: FormData;
	let username: String;
	let password: String;
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
</script>

<div class="flex-col p-6 {cl}">
	<div class="text-center">
		<p class="mt-3 text-gray-500 text-3xl dark:text-gray-300">Σύνδεση σε λογαριασμό</p>
	</div>

	<div class="mt-8">
		<form
			method="POST"
			action="?/login"
			use:enhance={({ formElement, formData, action, cancel }) => {
				loading = true;
				text = 'loading...';
				return async ({ result }) => {
					loading = false;
					try {
						if ((result.status = 200 && result?.data.verified)) {
							pb.authStore.loadFromCookie(result.data.st);
							te.message = 'Επιτυχής είσοδος!';
							te.background = 'bg-green-600';
							toastStore.trigger(te);
							let d =
								(await pb.collection('feeds').getFullList({
									sort: '-created'
								})) || [];
							if (d.length > 0) userFeeds.set(d);
							let r = await pb.collection('rations').getFullList({
								sort: '-created'
							});
							if (r.length > 0) userRations.set(r);
							try {
								goto('/');
							} catch (error) {
								console.log(error);
							}
						} else if (!result?.data.verified) {
							showVerification = true;
							emailVerif = result?.data?.email;
						}
					} catch (e) {
						console.log(e);
						text = 'Δεν μπόρεσε να πραγματοποιηθεί είσοδος.';
						te.background = 'bg-red-500';
						te.message = text;
						toastStore.trigger(te);
					}
				};
			}}
		>
			<div>
				<label for="email" class="block mb-2 text-xl text-gray-600 dark:text-gray-200 text-left"
					>Email</label
				>
				<input
					type="email"
					bind:value={username}
					name="email"
					id="email"
					placeholder="example@example.com"
					class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
				/>
			</div>

			<div class="mt-6">
				<div class="flex justify-between mb-2">
					<label for="password" class="text-xl text-gray-600 dark:text-gray-200">Κωδικός</label>
					<a
						href="/forgot-password"
						class="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline"
						>Ξέχασες τον κωδικό;</a
					>
				</div>

				<input
					type="password"
					bind:value={password}
					name="password"
					id="password"
					placeholder="Κωδικός"
					class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
				/>
			</div>

			<div class="mt-6">
				{#if loading}
					<LoadingCircles />
				{:else}
					<button
						class="w-full px-4 py-2 text-xl hover:underline tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
					>
						Είσοδος
					</button>
				{/if}
				{#if showVerification}
					<div class="card p-2 mt-4 bg-red-500 w-full flex flex-col">
						<p class="">
							Έχει σταλεί μήνυμα επιβεβαίωσης στο mail σου! Επιβεβαίωσε το email σου πριν συνδεθείς!
						</p>
						<button class="koumpi text-xs sm:text-base" on:click={sendVerif}
							>Ζήτα ξανά email επιβεβαίωσης</button
						>
					</div>
				{/if}
				<hr class="my-6" />
				<p class="mt-6 text-sm text-center text-gray-400">
					Δεν έχεις λογαριασμό; <a
						href="/register"
						class="text-blue-500 focus:outline-none focus:underline hover:underline">Κάνε εγγραφή</a
					>
				</p>
				<p class="my-3">ή</p>
				<div class="flex justify-center space-x-5">
					<SignInGoogle text={'Συνδέσου με'} />
					<SignInFacebook text={'Συνδέσου με'} />
				</div>
			</div>
		</form>
	</div>
</div>
