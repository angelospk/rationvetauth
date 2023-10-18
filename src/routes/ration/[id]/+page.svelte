<script lang="ts">
	import { metrics, feeds, userFeeds, loadedTables } from '$lib/stores/data';
	import type { State, TableState } from '$lib/stores/types';
	import FeedsTable from '$lib/FeedsTable.svelte';
	import TablePlaceHolder from '$lib/TablePlaceHolder.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ToastSettings } from '@skeletonlabs/skeleton';
	import { currentUser, pb } from '$lib/pocketbase';
	import { getModalStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	const modalStore = getModalStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 3000
	};
	let selc:string;
	let ration: State;
	let err = false;
	onMount(async () => {
		const modal: ModalSettings = {
			type: 'component',
			component: 'modalTrofes',
				response(r) {
				console.log(r)
				selc=r
			},
		};
		modalStore.trigger(modal);
		try {
			ration = await pb.collection('rations').getOne($page.params.id);
		} catch (error) {
			te.message = 'Απέτυχε η φόρτωση του σιτηρεσίου!';
			te.background = 'bg-red-600';
			toastStore.trigger(te);
			console.log(error);
			err = true;
		}
	});
	// reactive states updating table
	const t: TableState = {
		selfeeds: [
			{ Title: 'Καλαμπόκι', weight: 3 },
			{ id: 'ntw7z3mfbc5j61x', weight: 5 }
		],
		extraCols: ['Starch']
	};
</script>

{selc?selc:"no"}
{#if err}
	<h1 class="card p-4 bg-error-500">Ουψ! Το σιτηρέσιο δεν μπορεί να φορτωθεί!</h1>
{:else if $loadedTables && ration}
	<!-- selected={selected} columns={columns} -->
	<FeedsTable
		tableState={ration?.tableState}
		userFeeds={$userFeeds}
		feeds={$feeds}
		metrics={$metrics}
		edit={Boolean($currentUser)}
	/>
{:else}
	<TablePlaceHolder />
{/if}
