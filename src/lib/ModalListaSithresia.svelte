<script lang="ts">
	import { ListBox, ListBoxItem, getModalStore } from '@skeletonlabs/skeleton';
	import type { Feed } from './stores/types';

	// Props
	/** Exposes parent props to this component. */
	let { parent }: {parent: any} = $props();
	
	// Local
	let feed = $state<Feed>();
	const modalStore = getModalStore();
	let totalfeeds:Feed[];
	// Handle Form Submission
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(feed);
		modalStore.close();
	}
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? 'Άνοιγμα'}</header>
		<article>{$modalStore[0].body ?? 'Επέλεξε από τη λίστα για να φορτωθεί.'}</article>
		
		<select class="select border border-surface-500 p-4 hide-scrollbar" size="6" bind:value={feed}>
			{#each $modalStore[0].meta.metrs as metric}
			<option class="hover:bg-primary-300 hover:shadow-lg hover:underline" value="{metric}">{metric?.labelgr||metric?.Title}</option>
			{/each}

		</select>

		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" onclick={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" onclick={onFormSubmit}>Άνοιγμα</button>
    </footer>
	</div>
{/if}
