<script lang="ts">
	import { appState } from '$lib/stores/data.svelte';
	import type { State, TableState } from '$lib/stores/types';
	import FeedsTable from '$lib/FeedsTable.svelte';
	import TablePlaceHolder from '$lib/TablePlaceHolder.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { authState, pb } from '$lib/pocketbase.svelte';

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
	let rationName = $state("");
	let producerName = $state("");
	let selc = $state("");
	let ration = $state<State>();
	let ration_user_id = $state("");
	let err = $state(false);

	onMount(async () => {
		try {
			let fetchedRation = await pb.collection('rations').getOne($page.params.id || "");
			console.log(fetchedRation);
			producerName = fetchedRation.producerName;
			ration_user_id = fetchedRation.user || '';
			rationName = fetchedRation.rationName;
			ration = fetchedRation as unknown as State;
		} catch (error) {
			te.message = 'Απέτυχε η φόρτωση του σιτηρεσίου!';
			te.background = 'bg-red-600';
			toastStore.trigger(te);
			console.log(error);
			err = true;
		}
	});

	let copied = $state(false);

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

{#if err}
	<h1 class="card p-4 bg-error-500">Ουψ! Το σιτηρέσιο δεν μπορεί να φορτωθεί!</h1>
{:else if appState.loadedTables && ration}
	<RationInfo bind:producerName bind:rationName editable={true} />

	{#if authState.user &&( authState.user.id == ration_user_id || authState.user.role == 'admin')}
		<EditableTable stage2Read={ration} bind:currentState={ration} />
	{:else}
		<h1>Δεν μπορείς να επεξεργαστείς το σιτηρέσιο, γιατί δεν το έφτιαξες εσύ.</h1>
	{/if}
	<hr class="mb-9 print:hidden" />
	<div class="flex justify-center space-x-3 sm:space-x-5 text-xs sm:text-base">
		<button
			class="koumpi"
			onclick={async () => {
				if (!ration) return;
				try {
					ration.rationName = rationName;
					ration.producerName = producerName;
					console.log(ration);
					let a = await pb.collection('rations').update($page.params.id || "", ration);
					te.message = 'Το σιτηρέσιο αποθηκεύτηκε επιτυχώς!';
					te.background = 'bg-green-600';
					toastStore.trigger(te);

						let index = appState.userRations.findIndex((r) => r.id == $page.params.id);
						if (index !== -1) {
							// Update directly in state
							appState.userRations[index] = { ...appState.userRations[index], ...ration };
						}

				} catch (error) {
					te.message = 'Απέτυχε η αποθήκευση του σιτηρεσίου!';
					te.background = 'bg-red-600';
					toastStore.trigger(te);
					console.log(error);
				}
			}}>Αποθήκευση</button
		>
		<button class="koumpi" onclick={print}> Εκτύπωση</button>
	</div>
	<Accordion class="my-3 print:hidden text-center max-w-3xl mx-auto">
		<AccordionItem>
			{#snippet summary()}
				<p class={authState.user ? '' : 'line-through'}>Διαμοιρασμός</p>
			{/snippet}
			{#snippet content()}
				<div class="flex flex-col p-4">
						<p>Μοιράσου ή στείλε σε κάποιον το σιτηρέσιο στέλοντας τον παρακάτω σύνδεσμο.</p>
						<p class="bg-success-600 w-fit mx-auto rounded-lg border-1 shadow-lg">
							{$page.url.host.concat('/ration/', $page.params.id || "")}
						</p>
						<button
							class="koumpi w-fit mx-auto"
							use:clipboard={$page.url.host.concat('/ration/', $page.params.id || "")}
							onclick={onClickHandler}
							disabled={copied}
						>
							{copied ? 'Αντιγράφτηκε 👍' : 'Αντιγραφή στο πρόχειρο'}</button
						>
				</div>
			{/snippet}
		</AccordionItem></Accordion
	>
{:else}
	<LoadingCircles />
	<TablePlaceHolder />
{/if}
