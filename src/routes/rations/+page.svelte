<script lang="ts">
	import type { Feed } from '$lib/stores/types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userRations } from '$lib/stores/data';
	import { fly } from 'svelte/transition';
	function totalWeight(selfeeds: Feed[]) {
		return selfeeds.reduce((acc, curr) => acc + <number>curr.weight || 0, 0);
	}
	let mounted: boolean;
	onMount(() => {
		mounted = true;
	});
	function gotoration(id: string | null) {
		if (!id) return null;
		goto('/ration/' + id);
	}
</script>
{#if mounted}
	<p in:fly={{ y: -200, duration: 1000 }} class=" text-3xl lg:text-5xl heading mb-6">
		Τα Σιτηρέσιά μου
	</p>
{/if}
{#if $userRations.length == 0}
	<div>
		<button class="koumpi"
			><a href="/newration">
				<div class="flex">
					<svg
						class="w-6 h-6 mr-2 text-gray-800 dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 18"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 8h6m-3 3V5m-6-.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
						/>
					</svg> Φτιάξε το πρώτο σου σιτηρέσιο!
				</div></a
			></button
		>
	</div>
{:else if mounted}
	<div in:fly={{ y: 100, duration: 1000 }} class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each $userRations as ration}
			<button
				class="card card-hover bg-white shadow-lg rounded-lg p-4 mx-auto hover:variant-outline-secondary focus:animate-ping"
				on:click={gotoration(ration?.id || '')}
			>
				<div class="flex justify-between space-x-3 sm:space-x-10 items-start">
					<h2 class="text-lg font-semibold mb-2">{ration.rationName || 'Σιτηρέσιο Χωρίς Τίτλο'}</h2>
					<p class="text-xs text-gray-500">{ration.updated}</p>
				</div>
				<div class="mb-2">
					<strong>Από:</strong>
					{ration.producerName || ''}
				</div>
				<div>
					<strong>Βάρος Μείγματος:</strong>
					{totalWeight(ration.tableState.selfeeds)} kg
				</div>
			</button>
		{/each}
	</div>
{/if}
