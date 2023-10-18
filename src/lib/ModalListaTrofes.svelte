<script lang="ts">
	import { ListBox, ListBoxItem, getModalStore } from '@skeletonlabs/skeleton';
	import type { Feed } from './stores/types';
	import { userFeeds, feeds } from './stores/data';

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	
	// Local
	let feed:Feed;
	const modalStore = getModalStore();
	let totalfeeds:Feed[];
$:{
totalfeeds=[...$userFeeds, ...$feeds]
}
	// Handle Form Submission
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(feed);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal-slim shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? 'Άνοιγμα'}</header>
		<article>{$modalStore[0].body ?? 'Επέλεξε από τη λίστα για να φορτωθεί.'}</article>
		
		<select class="select border border-surface-500 p-4 hide-scrollbar" size="6" bind:value={feed}>
			{#each totalfeeds as ufeed}
			<option class="hover:bg-secondary-300 hover:shadow-lg select:scale-110" value="{ufeed}">{ufeed?.Title}</option>
			{/each}

		</select>
		<!-- <ListBox class="border border-surface-500 p-4">
		{#each totalfeeds as ufeed}
			<ListBoxItem bind:group={feed} name="chocolate" value="{ufeed}">{ufeed?.Title}</ListBoxItem>
		{/each}
		</ListBox> -->
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Άνοιγμα</button>
    </footer>
	</div>
{/if}
