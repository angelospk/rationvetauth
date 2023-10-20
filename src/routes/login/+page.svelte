<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { currentUser, pb } from '$lib/pocketbase';
	import { userFeeds } from '$lib/stores/data.js';
	import SignInGoogle from '$lib/SignInGoogle.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import LoadingCircles from '$lib/Loading Circles.svelte';
	import type { PageData } from './$types';
	import SignInFacebook from '$lib/SignInFacebook.svelte';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 3000
	};
	let username: String;
	let password: String;
	// export let data:PageData
	let text = 'loading';
	let loading = false;
	let comingFrom: string = $page.url.href;

	async function login() {
		await pb.collection('users').authWithPassword(username, password);
		goto('/');
	}
</script>

{#if $currentUser}
	<p>Είσαι ήδη εγγεργραμμένος!</p>
	<a
		href="/"
		class="my-3 btn btn-lg w-full variant-ghost-surface hover:underline hover:variant-filled-primary"
		>Επιστροφή στην Αρχική</a
	>
{:else}
	<img
		src="https://cdn.discordapp.com/attachments/1123335980074663936/1164725023022522409/descr.avif?ex=654441b5&is=6531ccb5&hm=8c7723dabb776897b7a197d39f3dc847dcc2c2ee56bec96c7a695dc20c5bca5b&"
		alt="logo"
		class="w-30 ml-15 rounded-t-3xl shadow-md"
	/>
	<div class=" flex justify-center ">
		<div
			class="hidden bg-bottom xl:block xl:w-1/2 shadow-md rounded-bl-3xl"
			style="background-image: url(https://media.discordapp.net/attachments/1123335980074663936/1164675279248167002/banner.webp?ex=65441361&is=65319e61&hm=1a6fbd5f3421bfa106391a7c2545fab6c18baf3132f04582e27f57e34f41a222&=&width=870&height=497)"
		>
			<div class="flex items-center h-full px-20 bg-gradient-to-bl from-gray-500 to-transparent bg-opacity-40">
				<div>
					<h2 class="text-3xl font-bold text-white">Εφαρμογή Επίλυσης Σιτηρεσίων</h2>

					<p class="max-w-xl mt-3 text-gray-300">
						Με χρήση της διαδυκτιακής εφαρμογής, μπορείτε να λύνετε χειροκίνητα, είτε με χρήση
						δυναμικού προγραμματισμόυ τα σιτηρέσια των παραγωγικών σας ζώων, καθώς και να τα
						μοιράζεστε με άλλους χρήστες.
					</p>
				</div>
			</div>
		</div>

		<div class="flex-col p-6 bg-gradient-to-br from-green-200 to-transparent rounded-br-3xl">

				<div class="text-center">
					<p class="mt-3 text-gray-500 dark:text-gray-300">Σύνδεση σε λογαριασμό</p>
				</div>

				<div class="mt-8">
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
								try {
									// console.log(form);
									pb.authStore.loadFromCookie(result.data.st);
									te.message = 'Επιτυχής είσοδος!';
									te.background = 'bg-green-600';
									toastStore.trigger(te);
									let d =
										(await pb.collection('feeds').getFullList({
											sort: '-created'
										})) || [];
									if (d.length > 0) userFeeds.set(d);
									try {
										window.history.back();
									} catch (error) {
										console.log(error);
										goto('/');
									}
								} catch (e) {
									console.log(e);
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
							<label
								for="email"
								class="block mb-2 text-sm text-gray-600 dark:text-gray-200 text-left">Email</label
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
								<label for="password" class="text-sm text-gray-600 dark:text-gray-200"
									>Κωδικός</label
								>
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
							<!-- <button on:click={login} -->
							{#if loading}
								<LoadingCircles />
							{:else}
								<button
									class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
								>
									Είσοδος
								</button>
							{/if}

							<hr class="my-6" />
							<p class="mt-6 text-sm text-center text-gray-400">
								Δεν έχεις λογαριασμό; <a
									href="/register"
									class="text-blue-500 focus:outline-none focus:underline hover:underline"
									>Κάνε εγγραφή</a
								>
							</p>
							<p class="my-3">ή</p>
							<div class="flex space-x-5">
								<SignInGoogle text={'Συνδέσου με'} />
								<SignInFacebook text={'Συνδέσου με'} />
							</div>
						</div>
					</form>
				</div>
		</div>
	</div>
{/if}
