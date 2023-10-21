<script lang="ts">
	import LoginComponent from './LoginComponent.svelte';

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
	<LoginComponent cl="card max-w-lg mx-auto " />
	<div
		class="w-full h-full bg-cover"
		style="background-image: url(https://cdn.discordapp.com/attachments/1123335980074663936/1164725023022522409/descr.avif?ex=654441b5&is=6531ccb5&hm=8c7723dabb776897b7a197d39f3dc847dcc2c2ee56bec96c7a695dc20c5bca5b&)"
	>
		<div class=" flex items-center">
			<!-- <div
				class="flex items-center h-full px-20"
			>
				<div class=" bg-gray-500 bg-opacity-80">
					<h2 class="text-3xl font-bold text-white">Εφαρμογή Επίλυσης Σιτηρεσίων</h2>

					<p class="max-w-xl mt-3 text-gray-300">
						Με χρήση της διαδυκτιακής εφαρμογής, μπορείτε να λύνετε χειροκίνητα, είτε με χρήση
						δυναμικού προγραμματισμόυ τα σιτηρέσια των παραγωγικών σας ζώων, καθώς και να τα
						μοιράζεστε με άλλους χρήστες.
					</p>
				</div>
			</div> -->
		</div>
	</div>
	<!-- <img
		src="https://cdn.discordapp.com/attachments/1123335980074663936/1164725023022522409/descr.avif?ex=654441b5&is=6531ccb5&hm=8c7723dabb776897b7a197d39f3dc847dcc2c2ee56bec96c7a695dc20c5bca5b&"
		alt="logo"
		class="w-30 rounded-t-3xl shadow-md"
	/> -->

	<!-- <div
		class="hidden bg-cover xl:block h-[500px] shadow-md rounded-3xl"
		style="background-image: url(https://media.discordapp.net/attachments/1123335980074663936/1164675279248167002/banner.webp?ex=65441361&is=65319e61&hm=1a6fbd5f3421bfa106391a7c2545fab6c18baf3132f04582e27f57e34f41a222&=&width=870&height=497)"
	>
		<div
			class="flex justify-center px-20 bg-gradient-to-bl from-gray-500 to-transparent bg-opacity-40"
		>
			<div>
				<h2 class="text-3xl font-bold text-white">Εφαρμογή Επίλυσης Σιτηρεσίων</h2>

				<p class="max-w-xl mt-3 text-gray-300">
					Με χρήση της διαδυκτιακής εφαρμογής, μπορείτε να λύνετε χειροκίνητα, είτε με χρήση
					δυναμικού προγραμματισμόυ τα σιτηρέσια των παραγωγικών σας ζώων, καθώς και να τα
					μοιράζεστε με άλλους χρήστες.
				</p>
			</div>
		</div>
	</div> -->
{/if}
