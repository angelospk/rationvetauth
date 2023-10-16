<script lang="ts">
	import { Accordion, Autocomplete, AccordionItem } from '@skeletonlabs/skeleton';
	import { InputChip } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	export let currentUser: any | null;

	const loginClick: PopupSettings = {
		event: 'hover',
		target: 'loginClick',
		placement: 'bottom'
	};

	let addFoodVisible = false;
	let addMetrics = false;
	let addUserFoodVisible = false;

	let inputChip = '';
	export let inputChipList: string[] = [];
	export let inputChipListUser: string[] = [];
	let inputMetric = '';
	export let inputmlist: string[] = [];
	export let autocompleteOptions: AutocompleteOption<string>[];
	export let metricsAutocomplete: AutocompleteOption<string>[];
	export let userFoodAutocomplete: AutocompleteOption<string>[];

	function userFeedsAppear() {
		addMetrics = false;
		addFoodVisible = false;
		addUserFoodVisible = !addUserFoodVisible;
	}
	function feedAddAppear() {
		addMetrics = false;
		addUserFoodVisible = false;
		addUserFoodVisible;
		addFoodVisible = !addFoodVisible;
	}
	function addMetricsAppear() {
		addFoodVisible = false;
		addUserFoodVisible = false;
		addMetrics = !addMetrics;
	}

	function onInputChipSelect(event: CustomEvent<AutocompleteOption<string>>): void {
		if (inputChipList.includes(event.detail.value) === false) {
			inputChipList = [...inputChipList, event.detail.value];
			inputChip = '';
		}
	}
	function onInputMetricSelect(event: CustomEvent<AutocompleteOption<string>>): void {
		if (inputmlist.includes(event.detail.value) === false) {
			inputmlist = [...inputmlist, event.detail.value];
			inputMetric = '';
		}
	}
	function onInputUserFeedSelect(event: CustomEvent<AutocompleteOption<string>>): void {
		if (inputChipListUser.includes(event.detail.value) === false) {
			inputChipListUser = [...inputChipListUser, event.detail.value];
			inputChip = '';
		}
	}
	function validateFoodInput(value: string): boolean {
		if (!autocompleteOptions.map((x) => x.label).includes(value)) return false;
		if (inputChipList.includes(value)) return false;
		if (feeds.filter((x) => x.keywords.includes(value))) {
			return true;
		}
	}
	function validateUserFoodInput(value: string): boolean {
		if (!userFoodAutocomplete.map((x) => x.label).includes(value)) return false;
		if (inputChipListUser.includes(value)) return false;
		if (userFoodAutocomplete.filter((x) => x.keywords.includes(value))) {
			return true;
		}
	}
	function validateMetricInput(value: string): boolean {
		// console.log(value,feeds);
		if (!metricsAutocomplete.map((x) => x.label).includes(value)) return false;
		if (inputmlist.includes(value)) return false;
		if (metricsAutocomplete.map((x) => x.label).includes(value)) {
			return true;
		}
	}
</script>

<div class="my-3 flex justify-between space-x-1 md:space-x-5">
	<button class="btn variant-filled w-1/3" on:click|preventDefault={feedAddAppear}
		>Δημόσιες Τροφές</button
	>
	{#if currentUser}
		<button class="btn variant-filled w-1/3" on:click|preventDefault={userFeedsAppear}
			>Τροφές Χρήστη</button
		>
	{:else}
		<button class="btn variant-filled w-1/3" on:click|preventDefault use:popup={loginClick}
			>Τροφές Χρήστη</button
		>

		<div class="card p-4 variant-filled-primary" data-popup="loginClick">
			<div class="arrow variant-filled-primary" />
			Συνδέσου για να αποθηκεύσεις και να χρησιμοποιήσεις δικές σου τροφες.
		</div>
	{/if}
	<button class="btn variant-filled w-1/3" on:click|preventDefault={addMetricsAppear}>
		Αλλαγή Στηλών</button
	>
</div>
<div class="my-3 flex justify-end print:hidden">
	{#if addMetrics}
		<div class="card max-w-md max-h-60 p-4 overflow-y-auto" tabindex="-1">
			<InputChip
				bind:input={inputMetric}
				bind:value={inputmlist}
				name="chips"
				validation={validateMetricInput}
				allowUpperCase
				placeholder="Εισάγετε στήλη..."
			/>
			<Autocomplete
				bind:input={inputMetric}
				options={metricsAutocomplete}
				denylist={inputmlist}
				on:selection={onInputMetricSelect}
			/>
		</div>
	{/if}
</div>
<div class="my-3 max-w-lg flex print:hidden">
	{#if addUserFoodVisible}
		<div
			class="card max-w-md mx-auto content-center justify-center max-h-60 p-4 overflow-y-auto"
			tabindex="-1"
		>
			<InputChip
				bind:input={inputChip}
				bind:value={inputChipListUser}
				name="στήλη"
				validation={validateUserFoodInput}
				allowUpperCase
				placeholder="Εισάγετε τροφή..."
			/>
			<Autocomplete
				bind:input={inputChip}
				options={userFoodAutocomplete}
				denylist={inputChipListUser}
				on:selection={onInputUserFeedSelect}
			/>
		</div>
	{/if}
</div>
<div class="my-3 max-w-lg flex justify-start print:hidden">
	{#if addFoodVisible}
		<div class="card max-w-md max-h-60 p-4 overflow-y-auto" tabindex="-1">
			<InputChip
				bind:input={inputChip}
				bind:value={inputChipList}
				name="στήλη"
				validation={validateFoodInput}
				allowUpperCase
				placeholder="Εισάγετε τροφή..."
			/>
			<Autocomplete
				bind:input={inputChip}
				options={autocompleteOptions}
				denylist={inputChipList}
				on:selection={onInputChipSelect}
			/>
		</div>
	{/if}
</div>

<style lang="postcss">
	.info {
		@apply my-2 bg-secondary-400 rounded-lg print:hidden;
	}
	.heading {
		font-size: x-large;
		margin-top: 1rem;
	}
	input[type='number'] {
		width: 3.5rem;
	}
	th,
	td {
		border: 1px dotted black;
	}
	@media print {
		/* Hide buttons and explanatory text */
		.btn {
			display: none;
		}
		th,
		td {
			border: 1px solid black;
		}
		.info {
			display: none;
		}
		/* Adjust table layout for printing */
	}
</style>
