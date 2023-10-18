<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type {PopupSettings } from '@skeletonlabs/skeleton';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	// import { metrics, feeds, userFeeds, type State } from '$lib/stores/data';
	import { currentUser, pb } from '$lib/pocketbase';
    import type { Feed, TableState, Column } from './stores/types';
	import { onMount } from 'svelte';
	
	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'top'
	};
	const optionsClick: PopupSettings = {
		event: 'click',
		target: 'optionsClick',
		placement: 'top'
	};
	let tableOptions = [
		{ label: 'Εμφάνιση Μονάδων', visible: true },
		{ label: 'Εμφάνιση Ποσοστού', visible: true },
		{ label: 'Εμφάνιση Ποσοστού ανά ΞΟ', visible: false }
	];
	export let edit = false;
	export let selected:Feed[]=[];
	export let columns:Column[]=[];
    let certain = [
		'Title',
		'weight',
		'DryMatter',
		'Fat',
		'CrudeFiber',
		'CrudeProtein',
		'Ash',
		'Calcium',
		'Phosphorus'
	];
	export let tableState:TableState={selfeeds:[], extraCols:[]}

export let metrics:Column[]=[];
export let feeds:Feed[]=[];
export let userFeeds:Feed[]=[];

// $: columns = metrics.filter((x) => certain.includes(x.Title));
	let sum = {};
	let emptySum;
	$: {
		let tmp = feeds[0] || {};
		if (tmp.length == 0) {
			certain.forEach((x) => {
				sum[x] = 0;
			});
		} else {
			for (let f in tmp) {
				if (typeof tmp[f] != 'string') {
					sum[f] = 0;
				}
			}
		}
		emptySum = { ...sum };
	}
	$: {
		sum = { ...emptySum }; // Reset the sum object to emptySum

		if (selected.length > 0) {
			for (let i = 0; i < selected.length; i++) {
				if (selected[i].weight==undefined) {
                    selected[i].weight=0
                }
                sum.weight += selected[i].weight;

				for (let m in sum) {
					if (m != 'weight') {
						if (selected[i].hasOwnProperty(m)) {
							sum[m] += selected[i].weight * selected[i][m];
						} else {
							// console.log(selected[i], m);
						}
					}
				}
			}
		}
		// saveState();
	}

	async function readState(tableState:TableState) {
		// Iterate through the given stateTable
		for (const item of tableState.selfeeds) {
			console.log('here', item, feeds, userFeeds);
			if (item.id && item.weight) {
				// If the item has an "id" and "weight", then find the matching item in userFeeds
				let userFeedItem = userFeeds.find((feed) => feed.id === item.id);

				// If not found in userFeeds, fetch from pocketbase
				if (!userFeedItem) {
					userFeedItem = await pb.collection('feeds').getOne(item.id, {
						expand: 'user'
					});
				}
				console.log(userFeedItem);
				// If the item is found (either in userFeeds or in pocketbase), push to the result
				if (userFeedItem) {
					selected.push({
						...userFeedItem, // Spread all properties of the userFeedItem
						weight: item.weight // Override with the weight from the stateTable
					});
				}
			} else if (item.Title && item.weight) {
				// If the item has a "Title" and "weight", then find the matching item in feeds
				const feedItem = feeds.find((feed) => feed.Title === item.Title);

				if (feedItem) {
					selected.push({
						...feedItem, // Spread all properties of the feedItem
						weight: item.weight // Override with the weight from the stateTable
					});
				}
			}
		}
		if (tableState.extraCols && tableState.extraCols.length > 0) {
			certain.push(...tableState.extraCols);
		}
		columns = metrics.filter((x) => certain.includes(x.Title));
		return {selected, columns}
;
	}

onMount(()=>{
	readState(tableState).then((r)=>{columns=r.columns;selected=r.selected})
})

	function formatNumber(number: Number) {
		return Number.isInteger(number) ? number.toString() : number.toFixed(2);
	}
</script>

<!-- Table for feedstuff entry -->

	<div class="flex space-x-5 md:space-x-10 justify-center print:hidden">
		<button
			class="btn-sm my-3 variant-ghost-secondary hover:scale-110"
			on:click|preventDefault
			use:popup={popupClick}>Επεξήγηση Πίνακα</button
		>
		<button
			class="btn-sm my-3 variant-ghost-secondary hover:scale-110"
			on:click|preventDefault
			use:popup={optionsClick}>Επιλογές Πίνακα</button
		>
	</div>
	<div class="card p-4 variant-filled-secondary z-10" data-popup="optionsClick">
		<ol>
			{#each tableOptions as option}
				<li>
					<SlideToggle
						name="slider-large"
						active="bg-primary-500"
						size="sm"
						bind:checked={option.visible}
					>
						{option.label}</SlideToggle
					>
				</li>
			{/each}
		</ol>
		<div class="arrow variant-filled-secondary" />
	</div>
	<button class="card p-4 variant-filled-secondary z-10" data-popup="popupClick" on:click|preventDefault>
		<p class="underline">Διατροφικά στοιχεία πίνακα:</p>
		<ul>
			<li>ΞΟ = Ξηρά Ουσία</li>
			<li>ΟΛΟ = Ολικές Λιπαρές Ουσίες</li>
			<li>ΟΚ = Ολικές Κυταρρίνες</li>
			<li>Ca = Ασβέστιο</li>
			<li>P = Φωσφόρος</li>
			<li>ΟΑΟ = Ολικές Αζωτούχες Ουσίες</li>
			<!-- <Accordion>
			<AccordionItem>
				<svelte:fragment slot="summary">Περισσότερα</svelte:fragment>
				<svelte:fragment slot="content">Θες κι άλλα ε; Ατιμούτσικο.</svelte:fragment>
			</AccordionItem></Accordion> -->
		</ul>
		<p class="text-xs my-2">
			Στη γραμμή "Σύνολο" οι μονάδες εκτός τη στήλης "Βάρος" είναι g ή kcal αντίστοιχα.
		</p>
		<div class="arrow variant-filled-secondary" />
	</button>

	<div class="relative overflow-x-auto">
		<table class="bg-white w-full table-hover" title={$currentUser?"Πίνακας Σιτηρεσίου":"Συνδέσου για να τον επεξεργαστείς και να τον αποθηκεύσεις!"}>
			<!-- Table headers -->
			<thead>
				<tr class="bg-stone-400 text-gray-700">
					{#each columns as column}
						<th class="text-primary w-min">{column.gr}</th>
					{/each}
				</tr>
				{#if tableOptions[0] && tableOptions[0].visible}
				<tr class="text-gray-700 bg-green-100 text-sm">
					{#each columns as column}
						{#if column.Title == 'Title'}
							<th class="text-black-700 w-min">Μονάδες</th>
						{:else if column.units !== undefined}
							<td>{column.units}</td>
						{:else}
							<td />
						{/if}
					{/each}
				</tr>
				{/if}
			</thead>

			<!-- Table body -->
			<tbody>
				{#each selected as feed, i}
					<tr class="">
						<td>
							<span class="w-min text-gray-500 text-sm">{feed.Title}</span>
						</td>
						<td>{#if edit}
							<input
									type="number"
									bind:value={feed.weight}
									min="0"
									step="1"
									style="width: 3rem;"
								/>
						{:else}
							<p>{feed.weight}</p>
						{/if}</td>

						{#each columns as column}
							{#if column.Title != 'Title' && column.Title != 'weight'}
								<td>
									<p>{feed[column.Title]}</p>
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr class="bg-gray-300 text-gray-700 text-lg">
					<td class="text-purple-500 w-min">Σύνολο</td>
					{#each columns as column}
						{#if column.Title != 'Title'}
							<td class="font-bold text-left pl-2">{formatNumber(sum[column.Title])}</td>
						{/if}
					{/each}
				</tr>
				{#if tableOptions[1] && tableOptions[1].visible}
					<tr class="bg-gray-200 text-gray-700">
						<td class="text-purple-500 w-min text-sm">Ποσοστό</td>
						<td />
						{#each columns as column}
							{#if column.Title != 'Title' && column.Title != 'weight'}
								{#if column.units == 'g/kg'}
									<td class="font-bold">{formatNumber(sum[column.Title] / sum['weight'] / 10)}</td>
								{:else}
									<td />
								{/if}
							{/if}
						{/each}
					</tr>
				{/if}
				{#if tableOptions[2] && tableOptions[2].visible}
					<tr class="bg-gray-200 text-gray-700">
						<td class="text-purple-500 w-min text-sm">Ποσοστό / ΞΟ </td>
						<td />
						{#each columns as column}
							{#if column.Title != 'Title' && column.Title != 'weight'}
								{#if column.units == 'g/kg'}
									<td class="font-bold"
										>{formatNumber((100 * sum[column.Title]) / sum.DryMatter)}</td
									>
								{:else}
									<td />
								{/if}
							{/if}
						{/each}
					</tr>
				{/if}
			</tfoot>
		</table>
	</div>
	<div class="secondary" style="margin-top: 5px;">
		<br />
	</div>


<style lang="postcss">

	th,
	td {
		border: 1px dotted black;
	}
	@media print {
		/* Hide buttons and explanatory text */

		th,
		td {
			border: 1px solid black;
		}

		/* Adjust table layout for printing */
	}
</style>
