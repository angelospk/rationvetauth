<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	let { parent }: {parent: any} = $props();

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { appState } from './stores/data.svelte';
	import type { State } from './stores/types';
	const modalStore = getModalStore();

	// Form Data
	let selected = $state<State>();
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(selected);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? 'Επέλεξε σιτηρέσιο'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Σιτηρέσιο</span>
				<!-- select from different user rations -->
				<select class="input" bind:value={selected}>
					{#each appState.userRations as ration}
						<option value={ration}>{ration.rationName}</option>
					{/each}
				</select>
			</label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" onclick={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" onclick={onFormSubmit}>Φόρτωση</button>
    </footer>
	</div>
{/if}
