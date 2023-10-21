<script lang="ts">
  import SignInGoogle from '../../lib/SignInGoogle.svelte';

	import { currentUser, pb } from '$lib/pocketbase';
	import SignInFacebook from '$lib/SignInFacebook.svelte';
	import { enhance } from '$app/forms';
	import LoadingCircles from '$lib/Loading Circles.svelte';

	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { userFeeds } from '$lib/stores/data';
	import Error from '../+error.svelte';
	const toastStore = getToastStore();
	let te: ToastSettings = {
	message: 'This message will auto-hide after 3 seconds.',
	timeout: 3000
};
	let username: String;
	let password: String;
	let loading = false;
	let passwordConfirm:string;
	let text:string;

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
			<div class="text-center">
				<h1 class="mt-3 text-gray-500 dark:text-gray-300">Δημιουργία Λογαριασμού</h1>
			</div>

			<div class="mt-8">
				<form method="POST"
				action="?/register"
				use:enhance={({ formElement, formData, action, cancel }) => {
					loading = true;
					// text="loading..."
					return async ({ result }) => {
						// `result` is an `ActionResult` object
						loading = false;
						console.log(result);
						try{
							// console.log(form);
							// pb.authStore.loadFromCookie(result.data.st);
							te.message="Επιτυχής εγγραφή!"
							te.background="bg-green-600"
							toastStore.trigger(te)
							te.background="bg-blue-600"
							te.message="Συνδέσου αφού επιβεβαιώσεις το email σου!"
							toastStore.trigger(te);
		// 					let d=await pb.collection('feeds').getFullList({
		// sort: '-created'
		// 					}) || [];
		// 					if (d.length>0) userFeeds.set(d)
							goto("/login");
							
						}
						catch(e){
						console.log(e)
						text="Δεν μπόρεσε να πραγματοποιηθεί εγγραφή.".concat(e)
						te.background="bg-red-500"
						te.message=text
						toastStore.trigger(te);
						// loading=true
						}
						
					};
				}}>
					<div>
						<label for="email" class="block mb-2 text-sm text-gray-600 dark:text-gray-200 text-left"
							>Email</label
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

					<div class="mt-6">
						<div class="flex justify-between mb-2">
							<label for="password" class="text-sm text-gray-600 dark:text-gray-200">Κωδικός</label>
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
							class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-400 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
						>
							Εγγραφή
						</button>
						{:else}
						<LoadingCircles/>
						{/if}
					</div>
					
				
					<p class="my-3">ή</p>
					<div class="flex space-x-5"><SignInGoogle text={"Κάνε έγγραφή με"}></SignInGoogle>
						<SignInFacebook text={"Κάνε εγγραφή με"}/></div>
				</form>
				<hr class="my-6" />
				<p class="mt-6 text-sm text-center text-gray-400">
					Έχεις λογαριασμό; <a
						href="/login"
						class="text-blue-500 focus:outline-none focus:underline hover:underline">Κάνε σύνδεση</a
					>.
				</p>
			</div>
		</div>
	</div>
{/if}
