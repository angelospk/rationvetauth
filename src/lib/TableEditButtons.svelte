<script lang="ts">
	import { Autocomplete, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { InputChip } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption, ModalSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import AutocompleteTest from './AutocompleteTest.svelte';
	import { fly } from 'svelte/transition';
	import { circIn } from 'svelte/easing';
	import type { Feed } from './stores/types';
	import { appState } from './stores/data.svelte';

	let {
		currentUser = null,
		inputChipList = $bindable([] as string[]),
		inputChipListUser = $bindable([] as string[]),
		inputmlist = $bindable([] as string[]),
		autocompleteOptions = [] as AutocompleteOption<string, unknown>[],
		metricsAutocomplete = [] as AutocompleteOption<string, unknown>[],
		userFoodAutocomplete = [] as AutocompleteOption<string, unknown>[]
	} = $props();

	// import {certain} from './AddFoods.svelte'
	const loginClick: PopupSettings = {
		event: 'hover',
		target: 'loginClick',
		placement: 'bottom'
	};

	let addFoodVisible = $state(false);
	let addMetrics = $state(false);
	let addUserFoodVisible = $state(false);
	const modalStore = getModalStore();
	const modal: ModalSettings={
		type:'component',
		component:'modalTr',
	}
	// const loadRation:ModalSettings={
	// 	type:'component',
	// 	component:'modalLoadRation',
	// 	response: async (r)=>{
	// 		// console.log(r)
	// 		try {
	// 			let d=await convertRationMixtoFeed(r)
	// 			$userFeeds=[...$userFeeds,d]
	// 		} catch (error) {
	// 			toastStore.trigger({message:'Απέτυχε η φόρτωση του σιτηρεσίου!',background:'bg-red-600'})
	// 		}
	// 	}
	// }
	let inputChip = $state('');
	let inputMetric = $state('');

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

	function onInputChipSelect(event: CustomEvent<AutocompleteOption<string, unknown>>): void {
		if (inputChipList.includes(event.detail.value) === false) {
			inputChipList = [...inputChipList, event.detail.value];
			inputChip = '';
		}
	}
	function onInputMetricSelect(event: CustomEvent<AutocompleteOption<string, unknown>>): void {
		if (inputmlist.includes(event.detail.value) === false) {
			inputmlist = [...inputmlist, event.detail.value];
			inputMetric = '';
		}
	}
	function onInputUserFeedSelect(event: CustomEvent<AutocompleteOption<string, unknown>>): void {
		if (inputChipListUser.includes(event.detail.value) === false) {
			inputChipListUser = [...inputChipListUser, event.detail.value];
			inputChip = '';
		}
	}
	function validateFoodInput(value: string): boolean {
		if (!autocompleteOptions.map((x) => x.label).includes(value)) return false;
		if (inputChipList.includes(value)) return false;
		if (autocompleteOptions.filter((x) => x.keywords.includes(value))) {
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
<div class="mx-auto max-w-3xl">
<div class="my-3 flex justify-between space-x-1 md:space-x-5">
	<button class="btn bg-secondary-active-token w-1/3 hover:text-white hover:bg-gradient-to-br variant-gradient-tertiary-secondary hover:duration-300 duration-300 " onclick={(e)=>{e.preventDefault(); feedAddAppear()}}
		>Τροφές<sup>1</sup></button
	>
	{#if currentUser}
		<button class="btn bg-secondary-active-token w-1/3 hover:text-white hover:bg-gradient-to-br variant-gradient-tertiary-secondary hover:duration-300 duration-300" onclick={(e)=>{e.preventDefault(); userFeedsAppear()}}
			>Τροφές Χρήστη</button
		>
	{:else}
		<button class="btn bg-gray-400 w-1/3" onclick={(e)=>e.preventDefault()} use:popup={loginClick}
			>Τροφές Χρήστη</button
		>

		<div class="card p-4 variant-filled-primary" data-popup="loginClick">
			<div class="arrow variant-filled-primary"></div>
			Συνδέσου για να αποθηκεύσεις και να χρησιμοποιήσεις δικές σου τροφες.
		</div>
	{/if}
	<button class="btn text-xs sm:text-base bg-secondary-active-token w-1/3 hover:text-white hover:bg-gradient-to-br variant-gradient-tertiary-secondary hover:duration-300 duration-300" onclick={(e)=>{e.preventDefault(); addMetricsAppear()}}>
		+/- <div class="p-1	"></div>Θρεπτικών Ουσιών</button
	>
</div>
<div class="my-3 flex justify-end print:hidden">
	{#if addMetrics}
		<div in:fly={{ y: -50, duration: 200, easing:circIn }}  class="card max-w-md max-h-60 p-4 overflow-y-auto" tabindex="-1">
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
		<div in:fly={{ y: -50, duration: 200, easing:circIn }} 
			class="card  max-w-md mx-auto content-center justify-center max-h-60 p-4 overflow-y-auto"
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
			<button class="btn mt-2 hover:translate-x-1 hover:bg-success-50-900-token btn-sm variant-outline-surface" onclick={()=>{modalStore.trigger(modal)}}>Επεξεργασία</button>
			<!--  <button class="btn mt-2 btn-sm variant-outline-surface" on:click={()=>{modalStore.trigger(loadRation)}}>Φόρτωση Σιτηρεσίου</button> -->
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
		<div in:fly={{ y: -50, duration: 200, easing:circIn }}  class="card max-w-md max-h-60 p-4 overflow-y-auto" tabindex="-1">
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
</div></div>

<style lang="postcss">

	@media print {
		/* Hide buttons and explanatory text */
		.btn {
			display: none;
			
		}
	}
</style>
