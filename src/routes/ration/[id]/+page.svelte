<script lang="ts">
	import { metrics, feeds, userFeeds, loadedTables } from '$lib/stores/data';
	import type { State, TableState } from '$lib/stores/types';
	import FeedsTable from '$lib/FeedsTable.svelte';
	import TablePlaceHolder from '$lib/TablePlaceHolder.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';

	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import RationInfo from '$lib/RationInfo.svelte';
	import { goto } from '$app/navigation';
	import LoadingCircles from '$lib/Loading Circles.svelte';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 3000
	};
	let selc: string;
	let ration: State;
	let err = false;

	onMount(async () => {
		try {
			ration = (await pb.collection('rations').getOne($page.params.id))
		} catch (error) {
			te.message = 'Απέτυχε η φόρτωση του σιτηρεσίου!';
			te.background = 'bg-red-600';
			toastStore.trigger(te);
			console.log(error);
			err = true;
		}
	});

	let showInfoCard = false;

	const print = () => {
		window.print();
	};
	function editRation(id: string | undefined) {
		goto(`/ration/${id}/edit`);
	}
	function navigateWithId(id: string | undefined) {
		goto(`/newration?id=${id}`);
	}
</script>
<!-- {selc?selc:"no"} -->
{#if err}
	<h1 class="card p-4 bg-error-500">Ουψ! Το σιτηρέσιο δεν μπορεί να φορτωθεί!</h1>
{:else if $loadedTables && ration }
<RationInfo producerName={ration?.producerName} rationName={ration?.rationName} currentDate={ration?.date} />
	<!-- selected={selected} columns={columns} -->
	<FeedsTable
		ration={ration}
		userFeeds={$userFeeds}
		feeds={$feeds}
		metrics={$metrics}
		edit={Boolean($currentUser)}
	/>

	<div class="flex justify-center space-x-1 sm:space-x-5 text-xs sm:text-base">
		{#if $currentUser?.id==ration?.user}
			
			<a class="koumpi btn-sm sm:btn-base" href={"/ration/"+ration?.id+"/edit"}><svg
				class="w-6 h-6 text-gray-800 dark:text-white"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 20 18"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4.109 17H1v-2a4 4 0 0 1 4-4h.87M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm7.95 2.55a2 2 0 0 1 0 2.829l-6.364 6.364-3.536.707.707-3.536 6.364-6.364a2 2 0 0 1 2.829 0Z"
				/>
			</svg> Επεξεργασία Σιτηρεσίου</a>

			<button class="koumpi" on:click={print}><div class="flex space-x-2 mr-2"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
				<path d="M5 20h10a1 1 0 0 0 1-1v-5H4v5a1 1 0 0 0 1 1Z"/>
				<path d="M18 7H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h14Z"/>
			  </svg> <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 18a.969.969 0 0 0 .933 1h12.134A.97.97 0 0 0 15 18M1 7V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2v5M6 1v4a1 1 0 0 1-1 1H1m0 9v-5h1.5a1.5 1.5 0 1 1 0 3H1m12 2v-5h2m-2 3h2m-8-3v5h1.375A1.626 1.626 0 0 0 10 13.375v-1.75A1.626 1.626 0 0 0 8.375 10H7Z"/>
			  </svg></div> Εκτύπωση</button>
		{:else}
		<a class="koumpi btn-sm sm:btn-base" href={"/newration?id=".concat(ration?.id)}> Δημιουργία Αντίγραφου και Επεξεργασία</a>
		{/if}
	</div>
{:else}
<LoadingCircles/>	
<TablePlaceHolder />
{/if}
