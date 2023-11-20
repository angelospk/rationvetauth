<script lang="ts">
	import { metrics, feeds, userFeeds, loadedTables, userRations } from '$lib/stores/data';
	import type { State, TableState } from '$lib/stores/types';
	import FeedsTable from '$lib/FeedsTable.svelte';
	import TablePlaceHolder from '$lib/TablePlaceHolder.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';

	import { AccordionItem, getToastStore, Accordion, clipboard } from '@skeletonlabs/skeleton';
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

	let copied = false;

	function onClickHandler(): void {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	}
	
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
						Object.assign(rations[index],ration);
						// rations[index] = ration;
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
			<svelte:fragment slot="summary"
				><p class={$currentUser ? '' : 'line-through'}>Διαμοιρασμός</p></svelte:fragment
			>
			<svelte:fragment slot="content"
				><div class="flex flex-col p-4">
						<p>Μοιράσου ή στείλε σε κάποιον το σιτηρέσιο στέλοντας τον παρακάτω σύνδεσμο.</p>
						<p class="bg-success-600 w-fit mx-auto rounded-lg border-1 shadow-lg">
							{$page.url.host.concat('/ration/', $page.params.id)}
						</p>
						<button
							class="koumpi w-fit mx-auto"
							use:clipboard={$page.url.host.concat('/ration/', $page.params.id)}
							on:click={onClickHandler}
							disabled={copied}
						>
							{copied ? 'Αντιγράφτηκε 👍' : 'Αντιγραφή στο πρόχειρο'}</button
						>
				</div>
			</svelte:fragment>
		</AccordionItem></Accordion
	>
{:else}
	<LoadingCircles />
	<TablePlaceHolder />
{/if}
