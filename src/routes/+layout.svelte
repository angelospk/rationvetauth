<script lang="ts">
	import '../app.postcss';
	import { TabAnchor, TabGroup, storePopup } from '@skeletonlabs/skeleton';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { page } from '$app/stores';
	import { pb , currentUser} from '$lib/pocketbase';
	// import { currentUser } from '$lib/stores/user'
	import type { PageData } from './$types'
	import { goto } from '$app/navigation';
import { initializeStores } from '@skeletonlabs/skeleton';
import {Toast} from '@skeletonlabs/skeleton';
import {feeds, metrics, userFeeds, loadedTables} from '$lib/stores/data'
import { onMount } from 'svelte';
import {Modal} from '@skeletonlabs/skeleton';
import { setContext } from 'svelte';
initializeStores();
export let data: PageData
onMount(async () => {
	pb.autoCancellation(false);
	const res = await fetch('/api/data');
	if (res.ok) {
			let dat = await res.json();
			feeds.set( dat.d[0].data);
			metrics.set( dat.d[1].data);
		}
	if ($currentUser){
		let d;
		try{d=await pb.collection('feeds').getFullList({
				sort: '-created'
		}) || [];
		userFeeds.set(d)}
		catch(err){console.log(err)}
		
		// console.log("added userfeeds ffrom layout", $userFeeds)
		loadedTables.set(true)
	}

		
})
// // Set the current user from the data passed in from the server
// $: currentUser.set(data.user)
storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
async function logout(){
	await pb.authStore.clear()
	userFeeds.set([]);
	goto("/");
}
// console.log(data, $metrics, $feeds);
$:{currentUser.set(pb.authStore.model||null)

}

</script>
<Modal />
<Toast />
<!-- App Shell -->
<AppShell>
	<title>Διαδυκτιακή Εφαρμογή Επίλυσης Σιτηρεσιών</title>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			
			<svelte:fragment slot="lead">
				<a href="/" class="text-xl uppercase">ΣΙΤ</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
			<div class="print:hidden flex text-xs sm:text-base sm:space-x-10">
				<TabGroup>
					<TabAnchor href="/" selected={$page.url.pathname === '/'}>Αρχική</TabAnchor>
					<TabAnchor href="/sit" selected={$page.url.pathname === '/sit'}>Επίλυση</TabAnchor>
					<TabAnchor href="/test" selected={$page.url.pathname === '/test'}>Τεστ</TabAnchor>
				</TabGroup>
				<!-- <a
					class="btn btn-sm variant-ghost-surface"
					href="/test"
					rel="noreferrer"
				>
					test
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="/sit"
					rel="noreferrer"
				>
					Επίλυση
				</a> -->
				{#if $currentUser}
				<button on:click={logout} class="btn btn-sm variant-ghost-surface hover:underline hover:variant-filled-primary">Αποσύνδεση</button>
				{:else}
					<a
						class="btn btn-sm variant-ghost-surface hover:underline hover:variant-filled-primary"
						href="/login"
						rel="noreferrer"
					>
						Σύνδεση
					</a>
				{/if}
			</div>	
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<div
		class="container h-full mx-auto md:w-full flex justify-center text-center items-center my-5 overflow-x-auto"
	>
	<div class="w-full md:w-4/5 lg:w-3/4 xl:w-2/3">
	<slot > </slot>
</div></div>
<svelte:fragment slot="pageFooter">
	<footer class="p-4 text-center text-secondary-700 dark:bg-secondary-700 dark:text-secondary-200 print:text-xs print:text-black">
		<hr class="border-t-1 mb-2 border-primary-500 mx-auto">
		<div class="flex-col">
		<div class="w-16 h-16 sm:w-24 sm:h-24 mx-auto my-1 print:h-12 print:w-12"><img class="rounded-full" src="https://www.auth.gr/wp-content/uploads/cropped-LogoAUTHblack300ppi.jpg" alt="logo"/></div>
		<div class="text-xs sm:text-base">Εργαστήριο Διατροφής <a class="hover:underline" href="https://www.vet.auth.gr">Κτηνιατρικής Σχολής ΑΠΘ</a><br>
			<div class="text-slate-600 dark:text-secondary-300 print:hidden">
				© {new Date().getFullYear()} | Powered by
			  <a class="text-primary-500 hover:underline" href="https://kit.svelte.dev/">SvelteKit</a> and
			  <a class="text-primary-500 hover:underline" href="https://pocketbase.io">PocketBase</a>
			</div>
			<div class="hidden italic print:block">	© {new Date().getFullYear()} | Δημιουργήθηκε με χρήση της ιστοσελίδας: <a href={$page.url.toString()}>{$page.url}</a></div></div></div>
	  </footer>
		  
</svelte:fragment>
</AppShell>

  