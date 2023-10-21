<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type {PopupSettings } from '@skeletonlabs/skeleton';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	// import { metrics, feeds, userFeeds, type State } from '$lib/stores/data';
	import { currentUser, pb } from '$lib/pocketbase';
    import type { Feed, TableState, Column } from './stores/types';
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'Προσοχή! Μια τροφή δεν μπόρεσε να φορτωθεί, καθώς έχει διαγραφτεί από τον δημιουργό της.',
		timeout: 5000,
		background: "bg-red-500"
	};
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
				// if (selected[i].weight==undefined) {
                //     selected[i].weight=0
                // }
                sum.weight += selected[i].weight;

				for (let m in sum) {
					if (m != 'weight') {
						if (selected[i].hasOwnProperty(m)) {
							sum[m] += selected[i].weight?selected[i].weight*selected[i][m]:0;
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
				try {
						userFeedItem = await pb.collection('feeds').getOne(item.id, {
							expand: 'user'
						});
				} catch (error) {
					toastStore.trigger(te);
					console.log(error);
				}
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
			class="shadow-xl rounded-full my-3 stroke-red-500 fill-red-500"
			on:click|preventDefault
			use:popup={popupClick}><svg class="w-8 h-8  hover:fill-red-300 text-secondary-500  dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
			  </svg></button
		>
		<button
			class="btn-sm rounded-full my-3 variant-ghost-secondary hover:text-white hover:bg-gradient-to-br variant-gradient-tertiary-secondary hover:scale-105 hover:duration-1000 duration-1000 "
			on:click|preventDefault
			use:popup={optionsClick}><svg class="w-6 h-6 hover:fill-gray-700 text-secondary-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"/>
			  </svg></button
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

	<div class="relative overflow-x-auto rounded-md">
		<table class="bg-white w-full table-auto" title={$currentUser?"Πίνακας Σιτηρεσίου":"Συνδέσου για να τον επεξεργαστείς και να τον αποθηκεύσεις!"}>
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
									step="1"
									min="0"
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
					<td class=" w-min">Σύνολο</td>
					{#each columns as column}
						{#if column.Title != 'Title'}
							<td class="font-bold">{formatNumber(sum[column.Title])}</td>
						{/if}
					{/each}
				</tr>
				{#if tableOptions[1] && tableOptions[1].visible}
					<tr class="bg-gray-200 text-gray-700">
						<td class=" w-min text-sm">Ποσοστό</td>
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
						<td class=" w-min text-sm">Ποσοστό / ΞΟ </td>
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
	/* input[type='number'] {
		width: 4.5rem;
	} */
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
