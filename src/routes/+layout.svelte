<script lang="ts">
	import '../app.postcss';
	import { TabAnchor, TabGroup, storePopup, type ModalComponent } from '@skeletonlabs/skeleton';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { page } from '$app/stores';
	import { pb, currentUser } from '$lib/pocketbase';
	import ModalExampleForm from '$lib/ModalExampleForm.svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';
	import { feeds, metrics, userFeeds, loadedTables } from '$lib/stores/data';
	import { onMount } from 'svelte';
	import { Modal } from '@skeletonlabs/skeleton';
	import ModalExampleList from '$lib/ModalListaTrofes.svelte';
	import ModalListaSithresia from '$lib/ModalListaSithresia.svelte';
	import Logo from '$lib/Logo.svelte';
	import { setContext } from 'svelte';
	import type { Feed } from '$lib/stores/types';
	import { fade } from 'svelte/transition';
	import LoadingCircles from '$lib/Loading Circles.svelte';
	initializeStores();
	export let data: PageData

	onMount(async () => {
		pb.autoCancellation(false);
		const res = await fetch('/api/data');
		if (res.ok) {
			let dat = await res.json();
			let fs = dat.d[0].data;
			fs.forEach((x: Feed) => (x.weight = 0));
			feeds.set(fs);
			metrics.set(dat.d[1].data);
		}
		if ($currentUser) {
			let d;
			try {
				d =
					(await pb.collection('feeds').getFullList({
						sort: '-created'
					})) || [];
				d.forEach((x: Feed) => (x.weight = 0));
				userFeeds.set(d);
			} catch (err) {
				console.log(err);
				userFeeds.set([]);
			}

			// console.log("added userfeeds ffrom layout", $userFeeds)
		}
		loadedTables.set(true);
	});
	// // Set the current user from the data passed in from the server
	// $: currentUser.set(data.user)
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	async function logout() {
		pb.authStore.clear();
		userFeeds.set([]);
		goto($page.url.pathname);
	}
	// console.log(data, $metrics, $feeds);
	$: {
		currentUser.set(pb.authStore.model || null);
	}
	const modalRegistry: Record<string, ModalComponent> = {
		// Set a unique modal ID, then pass the component reference
		modalComponentOne: { ref: ModalExampleForm },
		modalTrofes: { ref: ModalExampleList },
		modalSithresia: { ref: ModalListaSithresia }
		// modalComponentTwo: { ref: ModalComponentTwo },
		// ...
	};
</script>

<Modal components={modalRegistry} height="h-30" class="overflow-y-scroll" />
<Toast />
<!-- App Shell -->
{#if $loadedTables}
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
						<TabAnchor href="/newration" selected={$page.url.pathname === '/newration'}
							>Επίλυση</TabAnchor
						>
						<TabAnchor href="/test" selected={$page.url.pathname === '/test'}>Τεστ</TabAnchor>
					</TabGroup>

					{#if $currentUser}
						<button
							on:click={logout}
							class="btn btn-sm variant-ghost-surface hover:underline hover:bg-gradient-to-br variant-gradient-tertiary-primary"
							>Αποσύνδεση</button
						>
					{:else}
						<button
							class="btn btn-sm variant-ghost-surface hover:underline hover:bg-gradient-to-br variant-gradient-tertiary-primary"
							on:click={() => {
								
								goto('/login');
								
							}}
						>
							Σύνδεση
						</button>
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
			<slot />
		</div>
	</div>
	<svelte:fragment slot="pageFooter">
		<footer
			class="p-4 text-center text-secondary-700 dark:bg-secondary-700 dark:text-secondary-200 print:text-xs print:text-black"
		>
			<hr class="border-t-1 mb-2 border-primary-500 mx-auto" />
			<div class="flex-col">
				<div class="w-16 h-16 sm:w-24 sm:h-24 mx-auto my-1 print:h-12 print:w-12">
					<img
						class="rounded-full"
						src="https://www.auth.gr/wp-content/uploads/cropped-LogoAUTHblack300ppi.jpg"
						alt="logo"
					/>
				</div>
				<div class="text-xs sm:text-base">
					Εργαστήριο Διατροφής <a class="hover:underline" href="https://www.vet.auth.gr"
						>Κτηνιατρικής Σχολής ΑΠΘ</a
					><br />
					<div class="text-slate-600 dark:text-secondary-300 print:hidden">
						© {new Date().getFullYear()} | Powered by
						<a class="text-primary-500 hover:underline" href="https://kit.svelte.dev/">SvelteKit</a>
						and
						<a class="text-primary-500 hover:underline" href="https://pocketbase.io">PocketBase</a>
					</div>
					<div class="hidden italic print:block">
						© {new Date().getFullYear()} | Δημιουργήθηκε στο:
						<a href={$page.url.toString()}>{$page.url.origin}</a>
					</div>
				</div>
			</div>
		</footer>
	</svelte:fragment>
</AppShell>
{:else}
<div class="mx-auto  flex-col text-center items-center justify-center" >
<h1 class="text-4xl my-20 mx-auto"> Εφαρμογή Επίλυσης Σιτηρεσιών</h1>
<Logo />
<LoadingCircles/>
<h1 class="text-xl my-20 mx-auto"> Κτηνιατρική Σχολή ΑΠΘ</h1>

</div>

{/if}
