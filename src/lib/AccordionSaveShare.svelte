<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		clipboard,
		getToastStore,
		type PopupSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';

	// Your Svelte component
	import { authState, pb } from '$lib/pocketbase.svelte';
	import type { State } from '$lib/stores/types';
	import { enhance } from '$app/forms';
	import { appState } from './stores/data.svelte';
	import { page } from '$app/stores';
	import type { RecordModel } from 'pocketbase';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'Δεν μπόρεσε να αποθηκευτεί το σιτηρέσιο.',
		timeout: 3000,
		background: 'bg-green-600'
	};
	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'bottom'
	};
	let record = $state<State | RecordModel>();
	let { currentState = $bindable(), currentDate = $bindable() } = $props();

	async function saveRation() {
		let ration2save = { ...currentState };
		ration2save.date = currentDate;
		ration2save.user = authState.user?.id;
		if (ration2save.producerName == '') ration2save.producerName = authState.user?.name;
		console.log(ration2save);
		try {
			record = await pb.collection('rations').create(ration2save);
			te.message = 'Ο πίνακας σιτηρεσίου αποθηκεύτηκε επιτυχώς!';
			te.background = 'bg-green-600';
			toastStore.trigger(te);
			appState.userRations = [...appState.userRations, record];
		} catch (error) {
			console.log(error);
			// te.message=+"Πληροφορίες: ".concat(error)
			te.background = 'bg-red-600';
			toastStore.trigger(te);
		}
	}
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

<div class="text-center max-w-3xl mx-auto print:hidden text-slate-50">
	<Accordion>
		<AccordionItem>
			{#snippet lead()}
				<div class="flex space-x-2">
					<svg
						class="w-6 h-6 text-gray-800 dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M5 20h10a1 1 0 0 0 1-1v-5H4v5a1 1 0 0 0 1 1Z" />
						<path
							d="M18 7H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h14Z"
						/>
					</svg>
					<svg
						class="w-6 h-6 text-gray-800 dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 16 20"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 18a.969.969 0 0 0 .933 1h12.134A.97.97 0 0 0 15 18M1 7V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2v5M6 1v4a1 1 0 0 1-1 1H1m0 9v-5h1.5a1.5 1.5 0 1 1 0 3H1m12 2v-5h2m-2 3h2m-8-3v5h1.375A1.626 1.626 0 0 0 10 13.375v-1.75A1.626 1.626 0 0 0 8.375 10H7Z"
						/>
					</svg>
				</div>
			{/snippet}
			{#snippet summary()}
				Εκτύπωση
			{/snippet}
			{#snippet content()}
				<div class=" p-4">
					Εκτύπωσε ή αποθήκευσε ως pdf.<br /><button
						class="koumpi my-3"
						id="ekt"
						use:popup={popupHover}
						onclick={print}
					>
						Εκτύπωση</button
					>
					<div class=" p-4 rounded-lg variant-filled-primary" data-popup="popupHover">
						<div class="arrow variant-filled-primary"></div>
						Για περισσότερες από οχτώ Θρεπτκές Ουσίες στον πίνακα προτείνεται προσανατολισμός Landscape
						στην Εκτύπωση.
					</div>
				</div>
			{/snippet}
		</AccordionItem>
		<AccordionItem>
			{#snippet lead()}
				<svg
					class="w-6 h-6 ml-2 text-gray-800 dark:text-white"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 14 20"
				>
					<path
						d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z"
					/>
				</svg>
			{/snippet}
			{#snippet summary()}
				<p class={authState.user ? '' : 'line-through'}>Αποθήκευση</p>
			{/snippet}
			{#snippet content()}
				<div class=" p-4">
					{#if !authState.user}
						Συνδέσου για να μπορείς να αποθηκεύεις σιτηρέσια στο λογαριασμό σου.
					{:else}
						Αποθήκευσε το παραπάνω σιτηρέσιο για μελλοντική χρήση ή επεξεργασία. <br />
						<button class="koumpi my-3" onclick={saveRation}> Αποθήκευση</button>
					{/if}
				</div>
			{/snippet}
		</AccordionItem>
		<AccordionItem>
			{#snippet lead()}
				<svg
					class="w-6 h-6 ml-2 text-gray-800 dark:text-white"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"
					/>
				</svg>
			{/snippet}
			{#snippet summary()}
				<p class={authState.user ? '' : 'line-through'}>Διαμοιρασμός</p>
			{/snippet}
			{#snippet content()}
				<div class="flex flex-col p-4">
					{#if record && record?.id}
						<p>Μοιράσου ή στείλε σε κάποιον το σιτηρέσιο στέλοντας τον παρακάτω σύνδεσμο.</p>
						<p class="bg-success-600 w-fit mx-auto rounded-lg border-1 shadow-lg">
							{$page.url.host.concat('/ration/', record?.id)}
						</p>
						<button
							class="koumpi w-fit mx-auto"
							use:clipboard={$page.url.host.concat('/ration/', record?.id)}
							onclick={onClickHandler}
							disabled={copied}
						>
							{copied ? 'Αντιγράφτηκε 👍' : 'Αντιγραφή στο πρόχειρο'}</button
						>
					{:else}
						<p>Κάνε αποθήκευση σιτηρεσίου πρώτα.</p>
					{/if}
				</div>
			{/snippet}
		</AccordionItem>
	</Accordion>
</div>

<style lang="postcss">
	.info {
		@apply my-2 bg-secondary-400 rounded-lg print:hidden mx-auto max-w-lg;
	}
	.heading {
		font-size: x-large;
		margin-top: 1rem;
		@apply underline;
	}

	@media print {
		/* Hide buttons and explanatory text */
		.btn {
			display: none;
		}
		.info {
			display: none;
		}
		.heading {
			display: none;
		}
		/* Adjust table layout for printing */
	}
</style>
