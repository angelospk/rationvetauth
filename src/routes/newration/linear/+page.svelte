<script lang="ts">
	import EditableTable from '$lib/EditableTable.svelte';
	import RationInfo from '$lib/RationInfo.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { AnimalInfo, AnimalReqs, Form, State } from '$lib/stores/types';
	import AnimalFeedRequirements from '$lib/AnimalFeedRequirements.svelte';
	import { page } from '$app/stores';
	import { metrics } from '$lib/stores/data';
	import { reverseTransformObject } from '$lib/greekfuncts';
	let animals = $page.data;
	let metr = $metrics;
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'Δεν μπόρεσε να αποθηκευτεί το σιτηρέσιο.',
		timeout: 3000,
		background: 'bg-green-600'
	};
	let send2Email: string;
	let record: State;
	let loadedTable: boolean = false;
	let currentState: State;
	let info:AnimalInfo;
	let rationName = '';
	let form: AnimalReqs = { reqs: [], fractions: {} };
	let producerName = $currentUser?.name || '';
	let currentDate: string;
</script>

<div class="overflow-x-hidden">
	<div class="print:hidden">
		<h2 class="text-xl md:text-3xl lg:text-4xl font-bold mb-2">
			Επίλυση Σιτηρεσίου με Γραμμικό Προγραμματισμό
		</h2>
		<div class="justify-center inline-flex mb-4">
			<a href="/newration"
				><div
					class="mx-auto rounded-full hover:underline hover:bg-gray-200 hover:bg-opacity-75 hover:ring-2 btn outline-dotted outline-1"
				>
					<p class="md:text-lg">Χειροκίνητος Υπολογισμός Σιτηρεσίου</p>
					<p class="text-xs -mb-1" />
				</div></a
			>
		</div>
		<hr />
	</div>
	<div class="heading print:hidden">
		<h2>Βήμα 1: Γενικές Πληροφορίες</h2>
	</div>

	<div class="info">
		Συμπληρώστε μόνο αν έχετε σκοπό να αποθηκεύσετε ή να αποστείλετε το σιτηρέσιο.
	</div>
	<RationInfo bind:rationName bind:producerName bind:currentDate editable={true} />
	<!-- <GeneralInfo bind:rationName={rationName} bind:producerName={producerName} bind:currentDate /> -->

	<hr class="my-2" />

	<div class="heading print:hidden">
		<h2>Βήμα 2: Επιλογή Ζώου και Διατροφικές Ανάγκες</h2>
	</div>
	<div class="info" style="">
		Σημείωση: Προσθέστε τροφές πατώντας στο "Δημόσιες Τροφές".<br />
	</div>

	<AnimalFeedRequirements bind:form animals={animals?.animals} bind:animalInfo={info}/>
	<!-- {JSON.stringify(transformObject(form))} -->
	{#if form.reqs.length > 0}
			{#if info}
				<div class="flex-col">Ζώο: {info.animal}</div>
				<div class="flex-col">Κατηγορία: {info.type.selection}</div>
				<div class="flex-col">Υποκατηγορία: {info.type.subselection}</div>
			{/if}
			<div class="card p-3 flex space-x-3 overflow-x-auto">
			{#each form.reqs as req}
				
				<div class="flex flex-col">
				{metr.find((x) => x.Title == req.Title)?.gr || req.Title}
				{metr.find((x) => x.Title == req.Title)?.units||""}
				{#if req.type != "any"}
					<input bind:value={req.value} min=0 type="number"/>
				{/if}
				<select bind:value={req.type}>
					<option value="any">Οτιδήποτε</option>
					<option value="=">{"="}</option>
					<option value=">">{">"}</option>
					<option value="<">{"<"}</option>
					<option value="-">Ανάμεσα</option>
				</select>
				{#if req.type == "-"}
					<input bind:value={req.topValue} type="number"/>
				{/if}
				</div>
			{/each}
		</div>
	{/if}
	<hr class="my-5" />

	<div class="heading print:hidden">
		<h2>Βήμα 3: Εισαγωγή Τροφών</h2>
	</div>
	<div class="hidden print:block text-center text-lg my-3">Πίνακας Σιτηρεσίου</div>
	<div class="info" style="">
		Σημείωση: Προσθέστε τροφές πατώντας στο "Δημόσιες Τροφές".<br />
	</div>

	{#if !loadedTable}
		<EditableTable bind:rationName bind:producerName bind:currentState linear={true} requirementsString={reverseTransformObject(form)} requirements={form} />
	{:else}
		<EditableTable stage2Read={record} bind:currentState />
	{/if}
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
