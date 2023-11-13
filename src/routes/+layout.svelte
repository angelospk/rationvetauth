<script lang="ts">
	import '../app.postcss';
	import { TabAnchor, TabGroup, storePopup, type ModalComponent, type PopupSettings, popup, LightSwitch } from '@skeletonlabs/skeleton';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow, inline } from '@floating-ui/dom';
	import { page } from '$app/stores';
	import { pb, currentUser } from '$lib/pocketbase';
	import ModalExampleForm from '$lib/ModalExampleForm.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';
	import { feeds, metrics, userFeeds, loadedTables, userRations } from '$lib/stores/data';
	import { onMount } from 'svelte';
	import { Modal } from '@skeletonlabs/skeleton';
	import ModalExampleList from '$lib/ModalListaTrofes.svelte';
	import ModalListaSithresia from '$lib/ModalListaSithresia.svelte';
	import Logo from '$lib/Logo.svelte';
	import type { Feed } from '$lib/stores/types';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import ModalTrofes from '$lib/ModalTrofes.svelte';
	
	initializeStores();
	// export let data: PageData
	let loadingEnd:boolean;
	async function logout() {
		pb.authStore.clear();
		userFeeds.set([]);
		goto("/");
	}
	onMount(async () => {
		pb.autoCancellation(false);
		// if ($currentUser || $page.url.includes("ration"))
		if ($page.url.pathname == "/" || $page.url.pathname=="/about") loadedTables.set(true);
		const res = await fetch('/api/data');
		if (res.ok) {
			let dat = await res.json();
			console.log(dat)
			// let fs = dat.d[0].data;
			let fs=dat.d.pub
			fs.forEach((x: Feed) => {x.weight = 0; x.ratio=0; if(!x.price)  x.price=0;});
			feeds.set(fs);
			// metrics.set(dat.d[1].data);
			metrics.set(dat.d.orologies)
		}
		loadedTables.set(true);
		if ($currentUser) {
			let d;
			try {
				d =
					(await pb.collection('feeds').getFullList({
						sort: '-created'
					})) || [];
				d.forEach((x: Feed) => {x.weight = 0;x.ratio=0; if(!x.price)  x.price=0;});
				userFeeds.set(d);
				d= await pb.collection('rations').getFullList();
				userRations.set(d);
			} catch (err) {
				console.log(err);
				userFeeds.set([]);
			}

			// console.log("added userfeeds ffrom layout", $userFeeds)
		}
		setTimeout(() => {
			loadingEnd=true;
		}, 100);
	});
	
	// // Set the current user from the data passed in from the server
	// $: currentUser.set(data.user)
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow, inline });
	const popupSolve: PopupSettings = {
		event: 'click',
		target: 'popupSolve',
		placement: 'bottom'
	};
	const popupLogo: PopupSettings = {
		event: 'hover',
		target: 'popupLogo',
		placement: 'right'
	};
	const popupUser:PopupSettings = {
		event: 'click',
		target: 'popupUser',
		placement: 'left',
		middleware: {
			offset: 42,
		}
		
	};
	// console.log(data, $metrics, $feeds);
	$: {
		currentUser.set(pb.authStore.model || null);
	}
	const modalRegistry: Record<string, ModalComponent> = {
		// Set a unique modal ID, then pass the component reference
		modalLoadRation: { ref: ModalExampleForm },
		modalTrofes: { ref: ModalExampleList },
		modalSithresia: { ref: ModalListaSithresia },
		modalTr: {ref: ModalTrofes}
		// modalComponentTwo: { ref: ModalComponentTwo },
		// ...
	};
</script>
<Toast />
<Modal components={modalRegistry} height="h-30" class="overflow-y-scroll " />
<!-- App Shell -->
{#if $loadedTables}
	<AppShell regionPage="min-h-[93vh] print:min-h-0">
		<title>Διαδυκτιακή Εφαρμογή Επίλυσης Σιτηρεσιών</title>
		<svelte:fragment slot="header">
			<!-- App Bar -->
			
			<AppBar padding="0" spacing="0" background="transparent">
				<svelte:fragment slot="lead">
					{#if $loadedTables && loadingEnd}
					<button  on:click={()=>{
						if (browser) window.history.back();
					}} use:popup={popupLogo}  class="text-xl"
						><img
							class="mx-1 content-center w-[65px] h-[65px] hover:animate-[wiggle_2s_ease-in-out_infinite] {!loadingEnd?"animate-[wiggle_2s_ease-in-out_infinite]":""}"
							src="https://media.discordapp.net/attachments/1123335980074663936/1164590657545969784/minilogocr.webp?ex=6543c491&is=65314f91&hm=6b88ad5ea2464b4a6ba0a2c67fb3dcfa1881b8e4a06032080dd1a73d87bbfe30&=&width=530&height=487"
							alt="ΣΙΤ"
						/></button
					><div data-popup="popupLogo" class="p-2 card z-10">
						<div class="arrow bg-gradient-to-l from-transparent to-blue-400" />
						<p>Πάτα για να πας πίσω!</p>
					</div>{/if}
				</svelte:fragment>
				<!-- <svelte:fragment >
				<div class="content-center hidden sm:{"block flex"}">
					<a href="/" class="text-xl"><img class="absolute right-1/2 top-0  w-[65px] h-[65px] hover:animate-[wiggle_2s_ease-in-out_infinite] hover:scale-125" src="https://media.discordapp.net/attachments/1123335980074663936/1164590657545969784/minilogocr.webp?ex=6543c491&is=65314f91&hm=6b88ad5ea2464b4a6ba0a2c67fb3dcfa1881b8e4a06032080dd1a73d87bbfe30&=&width=530&height=487" alt="ΣΙΤ"></a>
				</div></svelte:fragment> -->
				<svelte:fragment slot="trail">


				<div class="print:hidden flex justify-between text-xs sm:text-base sm:space-x-10 sm:pr-2">
						<!-- <div><a href="/" class=" hidden: sm:block "
						><img
							class="mx-1 content-center w-[65px] h-[65px] hover:animate-[wiggle_2s_ease-in-out_infinite]"
							src="https://media.discordapp.net/attachments/1123335980074663936/1164590657545969784/minilogocr.webp?ex=6543c491&is=65314f91&hm=6b88ad5ea2464b4a6ba0a2c67fb3dcfa1881b8e4a06032080dd1a73d87bbfe30&=&width=530&height=487"
							alt="ΣΙΤ"
						/></a
					></div> -->
						<TabGroup class="text-slate-400" active="font-bold text-white"  hover="hover:variant-ghost-surface">
							<TabAnchor href="/" selected={$page.url.pathname === '/'}>Αρχική</TabAnchor>
							{#if $currentUser}
							<TabAnchor class="" selected={$page.url.pathname.includes("newration")}
								><button use:popup={popupSolve}>Επίλυση</button>
								<div class="p-2 rounded-lg variant-filled-secondary text-lg  z-10" data-popup="popupSolve">
									<div class="arrow variant-filled-secondary" />
									<ol>
										<li>
											<a class="hover:underline hover:bg-teal-400 hover:rounded-lg hover:shadow-lg" href="/newration">Χειροκίνητα</a>
										</li>
										<li>
											<a class="hover:underline hover:bg-teal-400 hover:rounded-lg hover:shadow-lg" href="/newration/linear">Αυτόματα</a>
										</li>
									</ol>
								</div>
							</TabAnchor>
							{/if}
							<TabAnchor
								class="overflow-clip"
								href="/about"
								selected={$page.url.pathname === '/about'}>Πληροφορίες</TabAnchor
							>
						</TabGroup>
						<div class="flex flex-col">
							<!--<div class="w-3 mb-2"><LightSwitch  /></div> -->
							{#if $currentUser}
							<button class="  rounded-full" use:popup={popupUser}
								><svg class="w-10 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
										<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
									  </svg></button
							>
							
							<div in:fly={{x:200,duration:500}} class="p-2 rounded-lg variant-filled-secondary absolute text-lg top-0 left-0 z-10" data-popup="popupUser">
								<div class="arrow variant-filled-secondary" />
								<ol>
									<li>
										<a class="hover:underline hover:bg-teal-400 hover:rounded-lg hover:shadow-lg" href="/profile">Επεξεργασία</a>
									</li>
									<li>
										<button class="hover:underline hover:bg-teal-400 hover:rounded-lg hover:shadow-lg" on:click={logout} >Αποσύνδεση</button>
									</li>
								</ol>
							</div>
							{/if}</div>
							<!-- <Dropdown class=""  containerClass="opacity-90 relative pr-10  "
							><DropdownItem><a href="/profile">Επεξεργασία</a></DropdownItem>
							<DropdownItem><button on:click={logout} >Αποσύνδεση</button></DropdownItem>
						</Dropdown> -->
							<!-- <a
								class="btn sm:mx-1 btn-sm variant-ghost-surface hover:underline hover:bg-gradient-to-br variant-gradient-tertiary-primary"
								href="/login"
							>
								Σύνδεση
							</a> -->
						
					</div>


				</svelte:fragment>
			</AppBar>
			 
			{#if $currentUser?.name == ''}
				<!-- <div class="w-fit text-center mx-auto"><div class=" w-full bg-gradient-to-t from-transparent to-red-500 text-center rounded-t-xl "><div class="w-full p-2"></div></div>
		<div class="flex"><div class="px-5 bg-gradient-to-l from-transparent to-red-500"></div>
		<span class="ml-2 mr-2">Άλλαξε το όνομα και τα στοιχεία επικοινωνίας σου <a class="underline" href="/profile">στο Προφίλ σου</a>. </span><div class="px-5 bg-gradient-to-r from-transparent to-red-500"></div></div>
		<div class=" p-2 w-full bg-gradient-to-t from-red-500 to-transparent rounded-b-xl"></div></div> -->
				<div
					class="w-fit text-center  mx-auto bg-red-500 bg-opacity-50 rounded-xl shadow-xl mt-1 text-lg print:hidden"
				>
					<span class="ml-2 mr-2"
						>Άλλαξε το όνομα και τα στοιχεία επικοινωνίας σου <a class="underline" href="/profile"
							>στο Προφίλ σου</a
						>.
					</span>
				</div>
			{/if}
		</svelte:fragment>
		<!-- Page Route Content -->
		<div
			class="container h-full mx-auto md:w-full flex justify-center text-center items-center my-5 overflow-x-hidden hide-scrollbar"
		>
			<div class="w-full">
				<slot />
			</div>
		</div>
		<svelte:fragment slot="pageFooter">
			<footer
				class="p-4 text-center text-slate-100 print:text-xs print:text-black"
			>
				<!-- <hr class="border-t-1 mb-2 border-primary-500 mx-auto" /> -->
				<div class="flex-col">
					<div
						class="w-16 h-16 sm:w-24 sm:h-24 mx-auto my-1 print:h-12 print:w-12 hover:animate-pulse"
					>
						<img
							class="rounded-full"
							src="https://www.auth.gr/wp-content/uploads/cropped-LogoAUTHblack300ppi.jpg"
							alt="logo"
						/>
					</div>
					<div class="text-xs sm:text-base">
						<div class="inline-flex gap-x-1"><p>Εργαστήριο Διατροφής </p><a class="hover:underline" href="https://www.vet.auth.gr"
							>Κτηνιατρικής </a
						>
						<p class="whitespace-pre-line"> x </p><a class="hover:underline" href="https://www.ee.auth.gr">ΤΗΜΜΥ ΑΠΘ</a></div><br />
						<div class="text-slate-100 dark:text-secondary-300 print:hidden">
							© {new Date().getFullYear()} | Powered by
							<a class="text-primary-500 hover:underline" href="https://kit.svelte.dev/"
								>SvelteKit</a
							>
							and
							<a class="text-primary-500 hover:underline" href="https://pocketbase.io">PocketBase</a
							>
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
	<div class="mx-auto h-screen flex-col text-center items-center justify-center">
		<h1 class="text-4xl my-20 mx-auto">Εφαρμογή Επίλυσης Σιτηρεσιών</h1>
		<Logo />
		<!-- <LoadingCircles/> -->
		<h1 class="text-xl my-20 mx-auto">Κτηνιατρική Σχολή ΑΠΘ</h1>
	</div>
{/if}

<style>

</style>