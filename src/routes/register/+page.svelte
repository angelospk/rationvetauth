<script lang="ts">
	import SignInGoogle from '../../lib/SignInGoogle.svelte';

	import { currentUser, pb } from '$lib/pocketbase';
	import SignInFacebook from '$lib/SignInFacebook.svelte';
	import { enhance } from '$app/forms';
	import LoadingCircles from '$lib/Loading Circles.svelte';

	import { RadioGroup, RadioItem, getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { userFeeds } from '$lib/stores/data';
	import Error from '../+error.svelte';
	import { P } from 'flowbite-svelte';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 3000
	};
	let username: String;
	let password: String;
	let loading = false;
	let passwordConfirm: string;
	let text: string;
	let val = 0;
	let name: string;
</script>

{#if $currentUser}
	<p>Είσαι ήδη εγγεργραμμένος!</p>
	<a
		href="/"
		class="my-3 btn btn-lg w-full variant-ghost-surface hover:underline hover:variant-filled-primary"
		>Επιστροφή στην Αρχική</a
	>
{:else}
	<div class="flex items-center w-full max-w-lg px-6 mx-auto">
		<div class="flex-1">
			<div class="text-center my-4">
				<h1 class="text-slate-100 dark:text-gray-300 text-3xl">Δημιουργία Λογαριασμού</h1>
			</div>

			<div class="mt-8">
				<form
					method="POST"
					action="?/register"
					use:enhance={({ formElement, formData, action, cancel }) => {
						loading = true;
						return async ({ result }) => {
							loading = false;
							console.log(result);
							try {
								te.message = 'Επιτυχής εγγραφή!';
								te.background = 'bg-green-600';
								toastStore.trigger(te);
								te.background = 'bg-blue-600';
								te.message = 'Συνδέσου αφού επιβεβαιώσεις το email σου!';
								toastStore.trigger(te);
								goto('/login');
							} catch (e) {
								console.log(e);
								text = 'Δεν μπόρεσε να πραγματοποιηθεί εγγραφή.'.concat(e);
								te.background = 'bg-red-500';
								te.message = text;
								toastStore.trigger(te);
							}
						};
					}}
				>
					<div class="flex justify-center">
						<p class="text-xl text-slate-100 pt-4 mr-5">Είμαι:</p>
						<div>
							<RadioGroup active="variant-filled-success" hover="hover:variant-soft-success">
								<RadioItem bind:group={val} name="justify" value={0}>Ιδιώτης</RadioItem>
								<RadioItem bind:group={val} name="justify" value={1}>Φοιτητής</RadioItem>
							</RadioGroup>
						</div>
					</div>
					<div>
						<label
							for="email"
							class="block mb-2 text-xl text-slate-100 dark:text-gray-200 text-left">Email</label
						>
						<input
							type="email"
							bind:value={username}
							name="email"
							id="email"
							placeholder="example@example.com"
							autocomplete="email"
							required={true}
							class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
						/>
					</div>
					{#if val == 0}
						<div>
							<label
								for="name"
								class="block my-3 text-xl text-slate-100 dark:text-gray-200 text-left"
								>Όνοματεπώνυμο (προεραιτικό)</label
							>
							<input
								type="text"
								bind:value={name}
								name="name"
								id="name"
								placeholder="Βασίλης Λεοντόκαρδος"
								required={false}
								class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
							/>
						</div>
					{:else}
						<div>
							<label
								for="name"
								class="block my-3 text-xl text-slate-100 dark:text-gray-200 text-left">ΑΕΜ</label
							>
							<input
								type="text"
								bind:value={name}
								name="name"
								id="name"
								placeholder="8392"
								required={true}
								class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
							/>
						</div>
					{/if}

					<div class="mt-6">
						<div class="flex justify-between mb-2">
							<label for="password" class=" text-slate-100 text-xl dark:text-gray-200"
								>Κωδικός</label
							>
						</div>

						<input
							type="password"
							bind:value={password}
							name="password"
							id="password"
							placeholder="Κωδικός"
							required={true}
							class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
						/>
					</div>
					<div class="mt-3">
						<input
							type="password"
							bind:value={passwordConfirm}
							name="passwordConfirm"
							id="passwordConfirm"
							placeholder="Επαλήθευση κωδικού"
							required={true}
							class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
						/>
					</div>

					<div class="mt-6">
						{#if !loading}
							<button
								class="w-full px-4 py-2 tracking-wide text-xl hover:underline text-white transition-colors duration-200 transform bg-blue-400 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
							>
								Εγγραφή
							</button>
						{:else}
							<LoadingCircles />
						{/if}
					</div>

					<p class="my-3 text-slate-100">ή</p>
					<div class="flex space-x-5">
						<SignInGoogle text={'Κάνε έγγραφή με'} />
						<SignInFacebook text={'Κάνε εγγραφή με'} />
					</div>
				</form>
				<hr class="my-6" />
				<p class="mt-6 text-slate-200 text-lg rounded-full text-center">
					Έχεις λογαριασμό; <a
						href="/login"
						class="text-blue-400 focus:outline-none focus:underline hover:underline">Κάνε σύνδεση</a
					>.
				</p>
			</div>
		</div>
	</div>
{/if}
