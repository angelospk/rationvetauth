<script lang="ts">
	import { metrics, feeds, userFeeds, loadedTables, userRations } from '$lib/stores/data';
	import type { State, TableState } from '$lib/stores/types';
	import FeedsTable from '$lib/FeedsTable.svelte';
	import TablePlaceHolder from '$lib/TablePlaceHolder.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';

	import { AccordionItem, getToastStore, Accordion } from '@skeletonlabs/skeleton';
	import type {  ToastSettings } from '@skeletonlabs/skeleton';
	import RationInfo from '$lib/RationInfo.svelte';
	import { goto } from '$app/navigation';
	import LoadingCircles from '$lib/Loading Circles.svelte';
	import EditableTable from '$lib/EditableTable.svelte';
	import { RecordService } from 'pocketbase';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 3000
	};
	let rationName: string;
	let producerName: string;
	let selc: string;
	let ration: State;
	let ration_user_id: string;
	let err = false;

	onMount(async () => {
		try {
			ration = await pb.collection('rations').getOne($page.params.id);
			console.log(ration);
			producerName = ration.producerName;
			ration_user_id = ration.user || '';
			rationName = ration.rationName;
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
</script>

<!-- {selc?selc:"no"} -->
{#if err}
	<h1 class="card p-4 bg-error-500">Ουψ! Το σιτηρέσιο δεν μπορεί να φορτωθεί!</h1>
{:else if $loadedTables && ration}
	<RationInfo bind:producerName bind:rationName editable={true} />
	<!-- selected={selected} columns={columns} -->
	<!-- <FeedsTable
		tableState={ration?.tableState}
		userFeeds={$userFeeds}
		feeds={$feeds}
		metrics={$metrics}
		edit={Boolean($currentUser)}
	/> -->
	{#if $currentUser &&( $currentUser.id == ration_user_id || $currentUser.role == 'admin')}
		<EditableTable stage2Read={ration} bind:currentState={ration} />
		<!-- <EditableTable bind:currentState={ration} 	/> -->
	{:else}
		<h1>Δεν μπορείς να επεξεργαστείς το σιτηρέσιο, γιατί δεν το έφτιαξες εσύ.</h1>
	{/if}
	<hr class="mb-9 print:hidden" />
	<div class="flex justify-center space-x-3 sm:space-x-5 text-xs sm:text-base">
		<button
			class="koumpi"
			on:click={async () => {
				try {
					ration.rationName = rationName;
					ration.producerName = producerName;
					console.log(ration);
					let a = await pb.collection('rations').update($page.params.id, ration);
					te.message = 'Το σιτηρέσιο αποθηκεύτηκε επιτυχώς!';
					te.background = 'bg-green-600';
					toastStore.trigger(te);
					userRations.update((rations) => {
						let index = rations.findIndex((r) => r.id == $page.params.id);
						rations[index] = ration;
						return rations;
					});
				} catch (error) {
					te.message = 'Απέτυχε η αποθήκευση του σιτηρεσίου!';
					te.background = 'bg-red-600';
					toastStore.trigger(te);
					console.log(error);
				}
			}}>Αποθήκευση</button
		>
		<button class="koumpi" on:click={print}> Εκτύπωση</button>
	</div>
	<Accordion class="my-3 print:hidden text-center max-w-3xl mx-auto">
		<AccordionItem>
			<svelte:fragment slot="lead"
				><svg
					class="w-6 h-6 ml-2 text-gray-800 dark:text-white"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"
					/>
				</svg></svelte:fragment
			>
			<svelte:fragment slot="summary">Αποστολή E-mail</svelte:fragment>
			<svelte:fragment slot="content" ><div class="card p-4 card-hover"></div>  test</svelte:fragment>
		</AccordionItem></Accordion
	>
{:else}
	<LoadingCircles />
	<TablePlaceHolder />
{/if}
