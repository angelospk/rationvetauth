<script lang="ts">
	import LoginComponent from './LoginComponent.svelte';

	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authState, pb } from '$lib/pocketbase.svelte';
	import { appState } from '$lib/stores/data.svelte';
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
	let username = $state("");
	let password = $state("");

	let text = 'loading';
	let loading = false;
	let comingFrom: string = $page.url.href;

	async function login() {
		await pb.collection('users').authWithPassword(username, password);
		goto('/');
	}
</script>

{#if authState.user}
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
		</div>
	</div>
{/if}
