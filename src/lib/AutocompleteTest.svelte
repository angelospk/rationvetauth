<script lang="ts">
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';

	let {
		options,
		selectedOptions = $bindable([]),
		placeholder = '',
		label = '',
		id = '',
		disabled = false
	} = $props();

	let inputValue = $state('');

	function onInputSelect(event: CustomEvent<AutocompleteOption<string>>): void {
		if (selectedOptions.includes(event.detail.value) === false) {
			selectedOptions = [...selectedOptions, event.detail.value];
			inputValue = '';
		}
	}

	function validateInput(value: string): boolean {
		if (!options.map((x) => x.label).includes(value)) return false;
		if (selectedOptions.includes(value)) return false;
		if (options.filter((x) => x.keywords.includes(value))) {
			return true;
		}
		return false;
	}
</script>

<div class="autocomplete-card">
	<label for={id}>{label}</label>
	<!-- Autocomplete from skeleton might still use on:select, but we use onclick handler on components usually via callbacks.
         However, library components might strictly emit events. Svelte 5 supports on:event for compatibility. -->
	<Autocomplete
		{id}
		{options}
		on:selection={onInputSelect}
		bind:input={inputValue}
		{placeholder}
		{disabled}
	/>
	{#if selectedOptions.length > 0}
		<div class="selected-options">
			{#each selectedOptions as option}
				<span class="selected-option">{option}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.autocomplete-card {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
	}

	.selected-options {
		display: flex;
		flex-wrap: wrap;
		margin-top: 0.5rem;
	}

	.selected-option {
		background-color: #e2e8f0;
		border-radius: 0.25rem;
		color: #4a5568;
		display: inline-block;
		font-size: 0.875rem;
		margin-right: 0.5rem;
		margin-bottom: 0.5rem;
		padding: 0.25rem 0.5rem;
	}
</style>
