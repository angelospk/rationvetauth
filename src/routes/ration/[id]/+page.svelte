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


	function navigateWithId(id: string | undefined) {
		goto(`/newration?id=${id}`);
	}
</script>
{JSON.stringify(ration||null)}
<!-- {selc?selc:"no"} -->
{#if err}
	<h1 class="card p-4 bg-error-500">Ουψ! Το σιτηρέσιο δεν μπορεί να φορτωθεί!</h1>
{:else if $loadedTables && ration}
<RationInfo producerName={ration?.producerName} rationName={ration?.rationName} currentDate={ration?.date} />
	<!-- selected={selected} columns={columns} -->
	<FeedsTable
		tableState={ration?.tableState}
		userFeeds={$userFeeds}
		feeds={$feeds}
		metrics={$metrics}
		edit={Boolean($currentUser)}
	/>

	<div class="flex justify-center space-x-1 sm:space-x-5 text-xs sm:text-base">
		{#if $currentUser?.id==ration?.user}
			<button class="btn variant-filled-secondary btn-sm sm:btn-base">Αποθήκευση Βαρών</button>
			<button class="btn variant-filled-secondary btn-sm sm:btn-base"> Επεξεργασία Σιτηρεσίου</button>
		{:else}
		<button class="btn variant-filled-secondary btn-sm sm:btn-base" on:click={navigateWithId(ration?.id)}> Δημιουργία Αντίγραφου και Επεξεργασία</button>
		{/if}
	</div>
{:else}
<LoadingCircles/>	
<TablePlaceHolder />
{/if}
