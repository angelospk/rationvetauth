<script lang="ts">
	import { ListBox, ListBoxItem, getModalStore } from '@skeletonlabs/skeleton';
	import type { Feed } from './stores/types';

	// Props
	/** Exposes parent props to this component. */
	let { parent } = $props();
	//console out parrent element
    
	// Local
	let feed:Feed;
	const modalStore = getModalStore();
	let totalfeeds:Feed[];
	// Handle Form Submission

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? 'Περιορισμοί'}</header>
		<article>{$modalStore[0].body ?? 'Εισαγωγή περιορισμών για τις επιλεγμένες τροφές.'}</article>
        {#each $modalStore[0].meta.constraints as cons}
        <div class="inline-flex"><p>{cons.Title}</p> <input min=0 max=100 type="number" bind:value={cons.low}/><p>-</p>
        <input type="number" min=0 max=100 bind:value={cons.high}/>
        </div>
        {/each}
	</div>
{/if}
