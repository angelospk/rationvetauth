<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { Feed, TableState, Column, State } from './stores/types';
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import convertMixToFeed from './EditableTable.svelte';
	import { formatNumber } from './greekfuncts';
	import { fade, slide } from 'svelte/transition';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message:
			'Προσοχή! Μια τροφή δεν μπόρεσε να φορτωθεί, καθώς έχει διαγραφτεί από τον δημιουργό της.',
		timeout: 5000,
		background: 'bg-red-500'
	};
	const popupClick: PopupSettings = {
		event: 'hover',
		target: 'popupClick',
		placement: 'top'
	};
	const optionsClick: PopupSettings = {
		event: 'click',
		target: 'optionsClick',
		placement: 'top'
	};
	export let linear: boolean = false;
	
	let tableOptions = {
		displayUnits: { label: 'Εμφάνιση Μονάδων', visible: true },
		displayPercentage: { label: 'Εμφάνιση Ποσοστού', visible: !linear },
		displayDMPercentage: { label: 'Εμφάνιση Ποσοστού ανά ΞΟ', visible: false },
		ratios: { label: 'Βάρη < > Αναλογίες', visible: linear }
	};
	export let ratiosSelected=tableOptions.ratios.visible;
	$: ratiosSelected=tableOptions.ratios.visible;
	export let edit = false;
	export let selected: Feed[] = [];
	export let columns: Column[] = [];
	export let totalWeight = 100;
	let certain = linear
		? [
				'Title',
				'weight',
				'DryMatter',
				'Fat',
				'CrudeFiber',
				'CrudeProtein',
				'Ash',
				'Calcium',
				'Phosphorus'
		  ]
		: ['Title', 'weight', 'DryMatter', 'Fat', 'CrudeFiber', 'CrudeProtein'];
	export let ration: State = {totalWeight:0, producerName:"",rationName:"" ,tableState:{selfeeds: [], extraCols: [] }};
	export let requirements = {};
	export let metrics: Column[] = [];
	export let feeds: Feed[] = [];
	export let userFeeds: Feed[] = [];

	// $: columns = metrics.filter((x) => certain.includes(x.Title));
	let sum = {};
	let totalRatio = {};
	let emptySum, emptyRatio;

	$: {
		// Initialize sum and emptySum similar to your existing code
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
		emptyRatio = { ...sum };
	}

	$: {
		sum = { ...emptySum }; // Reset the sum object to emptySum
		totalRatio = { ...emptyRatio }; // Reset the totalRatio object to emptyRatio
		if (selected.length > 0) {
			for (let i = 0; i < selected.length; i++) {
				let feedRatio = selected[i].ratio || 0; // Default ratio is 1 if not defined

				sum.weight += selected[i].weight;
				totalRatio.weight += feedRatio;
				// Loop through each metric in the sum object
				for (let m in sum) {
					if (m != 'weight') {
						if (selected[i].hasOwnProperty(m)) {
							// Modify the sum with weighted values
							sum[m] += selected[i].weight ? selected[i].weight * selected[i][m] : 0;

							// Calculate the totalRatio with weighted values
							// totalRatio[m] = (totalRatio[m] || 0) + feedRatio * sum[m];
							totalRatio[m] += (feedRatio * selected[i][m]) / 100;
						} else {
							selected[i][m] = 0;
						}
					}
				}
			}
			ration.totalWeight=sum.weight;
		}
	}
	async function convertRationMixtoFeed(ration: State): Promise<Feed> {
		let selectedMixFeeds: Feed[] = [];
		let publicFeeds: Feed[] = ration.tableState.selfeeds.filter((x) => x.public);
		publicFeeds.forEach((item) => {
			const feedItem = feeds.find((feed) => feed.Title === item.Title);
			if (feedItem) {
				feedItem.ratio = ration.tableState.ratios?item.ratio:item.weight||0/ration.totalWeight;
				selectedMixFeeds.push(feedItem);
			} else {
				//no public food found
				console.log(`Δε βρέθηκε η τροφή ${item.Title} στη βάση δεδομένων.`);
				te.message = `Δε βρέθηκε η τροφή ${item.Title} στη βάση δεδομένων.`;
				te.background = 'bg-error-400';
				toastStore.trigger(te);
			}
		});
		let foods2Fetch: string[] = [];
		let uFeedsRead: Feed[] = ration.tableState.selfeeds.filter((x) => !x.public && !x.mix);
		uFeedsRead.forEach((item) => {
			const feedItem = userFeeds.find((feed) => feed.id === item.id);
			if (feedItem) {
				feedItem.ratio =ration.tableState.ratios?item.ratio:item.weight||0/ration.totalWeight;
				selectedMixFeeds.push(feedItem);
			} else {
				if (item.id) foods2Fetch.push(item.id);
			}
		});
		let fetchedFeeds;
		if (foods2Fetch.length > 0) {
			try {
				fetchedFeeds = await pb.collection('feeds').getList(1, 50, {
					filter: `id=('${foods2Fetch.join("'||id='")}')`
				});
				console.log('fetched feeds', fetchedFeeds);
			} catch (error) {
				console.log('error fetching feeds', error);
			}
		}
		if (fetchedFeeds && fetchedFeeds.items.length > 0 && uFeedsRead && uFeedsRead.length > 0) {
			fetchedFeeds.items.forEach((item) => {
				const found=uFeedsRead.find((x) => x.id == item.id)
				if (found){
				found.ratio = ration.tableState.ratios?item.ratio||0:item.weight||0/ration.totalWeight;
				selectedMixFeeds.push(item);
			}
			});
		}
		let mixFeeds: Feed[] = ration.tableState.selfeeds.filter((x) => !x.public && x.mix);
		mixFeeds.forEach(async (item) => {
			try {
				const rationMix: State = await pb.collection('rations').getOne(item.id);
				const userFeedItem = await convertRationMixtoFeed(rationMix);
				userFeedItem.ratio = ration.tableState.ratios?item.ratio||0:item.weight||0/ration.totalWeight;
				// might need to update feed weights or ratios here
				selectedMixFeeds.push(userFeedItem);
			} catch (error) {
				console.log("Δε βρέθηκε το σιτηρέσιο στη βάση δεδομένων.", error);
				te.message = 'Δε βρέθηκε ένα σιτηρέσιο στη βάση δεδομένων.';
				te.background = 'bg-error-400';
				toastStore.trigger(te);
			}

		});
		 
		// create a feed item
		let feed=feeds[0]
		for (let x in feed){
			if (typeof feed[x]=="number") feed[x]=0;
		}

		selectedMixFeeds.forEach((item) => {
			for (let x in feed){
				if (typeof feed[x]=="number" && x!="weight" && x!="ratio") {
					const r=item.ratio>1?item.ratio/100:item.ratio;
					feed[x]+=item[x]*r
}
			}
		});
		feed.Title = ration.rationName;
		feed.weight = ration.totalWeight;
		feed.ratio = 0;
		feed.id=ration.id;
		feed.mix=true;
		return feed;
	}
	function formatWeights() {
		for (let i = 0; i < selected.length; i++) {
			selected[i].weight = (selected[i].ratio * totalWeight) / 100;
		}
	}
	function formatRatios() {
		for (let i = 0; i < selected.length; i++) {
			selected[i].ratio = (selected[i].weight / sum.weight) * 100;
		}
		totalWeight = sum.weight;
	}
	async function readState(tableState: TableState) {
		// Iterate through the given stateTable
		for (const item of tableState.selfeeds) {
			console.log('here', item, feeds, userFeeds);
			if (!item.mix) {
				if (item.id ) {

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
					// If the item is found (either in userFeeds or in pocketbase), push to the result
					if (userFeedItem) {
						selected.push({
							...userFeedItem, // Spread all properties of the userFeedItem
							weight: tableState.ratios?item.ratio||0*ration.totalWeight:item.weight // Override with the weight from the stateTable
						});	
					}
				} else if (item.Title ) {

					// If the item has a "Title" and "weight", then find the matching item in feeds
					const feedItem = feeds.find((feed) => feed.Title === item.Title);

					if (feedItem) {
						selected.push({
							...feedItem, // Spread all properties of the feedItem
							weight: tableState.ratios?item.ratio||0*ration.totalWeight:item.weight // Override with the weight from the stateTable
						});
					}
				}
			} else {
				//feed is mix. So then, load the mix and add it to the selected
				let mixItem:State;
				try {
					mixItem = await pb.collection('rations').getOne(item.id||"");
					let foodMix=await convertRationMixtoFeed(mixItem);
					console.log(foodMix)
					selected.push({
						...foodMix, // Spread all properties of the feedItem
						weight: item.weight // Override with the weight from the stateTable
					});
				} catch (error) {
					te.message="Δεν μπόρεσε να φορτωθεί ένα μείγμα"
					te.background="bg-red-500"
					toastStore.trigger(te);
					console.log(error)
				}
			}
		}
		if (tableState.extraCols && tableState.extraCols.length > 0) {
			certain.push(...tableState.extraCols);
		}
		columns = metrics.filter((x) => certain.includes(x.Title));
		return { selected, columns };
	}

	onMount(() => {
		readState(ration.tableState).then((r) => {
			columns = r.columns;
			selected = r.selected;
		});
	});
</script>

<!-- Table for feedstuff entry -->
<div class="flex space-x-5 md:space-x-10 justify-center print:hidden">
	<button class="shadow-xl rounded-full my-3 stroke-red-500 fill-red-500" use:popup={popupClick}
		><svg
			class="w-8 h-8 hover:fill-red-300 text-secondary-500 dark:text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 20 20"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg></button
	>
	<button
		class="btn-sm rounded-full my-3 variant-ghost-secondary hover:text-white hover:bg-gradient-to-br variant-gradient-tertiary-secondary hover:scale-105 hover:duration-1000 duration-1000"
		use:popup={optionsClick}
		><svg
			class="w-6 h-6 hover:fill-gray-700 text-secondary-500 dark:text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 20 20"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
			/>
		</svg></button
	>
</div>
<div class="card p-4 variant-filled-secondary z-10" data-popup="optionsClick">
	<ol>
		<li>
			<SlideToggle
				name="slider-large"
				active="bg-primary-500"
				size="sm"
				bind:checked={tableOptions.ratios.visible}
			>
				{tableOptions.ratios.label}</SlideToggle
			>
		</li>
		<li>
			<SlideToggle
				name="slider-large"
				active="bg-primary-500"
				size="sm"
				bind:checked={tableOptions.displayUnits.visible}
			>
				{tableOptions.displayUnits.label}</SlideToggle
			>
		</li>
		<li>
			<SlideToggle
				name="slider-large"
				active="bg-primary-500"
				size="sm"
				bind:checked={tableOptions.displayPercentage.visible}
			>
				{tableOptions.displayPercentage.label}</SlideToggle
			>
		</li>
		<li>
			<SlideToggle
				name="slider-large"
				active="bg-primary-500"
				size="sm"
				bind:checked={tableOptions.displayDMPercentage.visible}
			>
				{tableOptions.displayDMPercentage.label}</SlideToggle
			>
		</li>
	</ol>
	<div class="arrow bg-gradient-to-l from-transparent to-blue-400" />
</div>
<button
	class="card p-4 variant-filled-secondary z-10"
	data-popup="popupClick"
	on:click|preventDefault
>
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
	<div class="arrow bg-gradient-to-l from-transparent to-blue-400" />
</button>

<div class="overflow-x-auto rounded-md">
	<table
		transition:fade={{ duration: 300 }}
		class="bg-white w-full table-row-checked"
		title={$currentUser
			? 'Πίνακας Σιτηρεσίου'
			: 'Συνδέσου για να τον επεξεργαστείς και να τον αποθηκεύσεις!'}
	>
		<!-- Table headers -->
		<thead>
			{#if requirements.hasOwnProperty('ΚΤ')}
				<tr class="bg-gray-200 text-gray-700 text-lg">
					<th colspan="5">ΚΤ: {requirements.ΚΤ || ''} g/μέρα</th>
				</tr>
			{/if}
			<tr class="bg-stone-400 text-gray-700">
				{#if linear}
					<th class="text-primary w-min">Τιμή</th>
				{/if}
				{#each columns as column}
					{#if column.Title == 'weight'}
						<th
							class="text-primary w-min hover:cursor-pointer"
							on:click={() => {
								if (tableOptions.ratios.visible) {
									formatWeights();
								} else {
									formatRatios();
								}
								tableOptions.ratios.visible = !tableOptions.ratios.visible;
							}}
						>
							<button>
								{#if tableOptions.ratios.visible}
									Αναλογία
								{:else}
									Βάρος
								{/if}
							</button></th
						>
					{:else}
						<th class="text-primary w-min">{column.gr}</th>
					{/if}
				{/each}
			</tr>
			{#if tableOptions.displayUnits.visible}
				<tr class="text-gray-700 bg-green-100 text-sm">
					{#if linear}
						<td class="w-min">€/kg</td>
					{/if}
					{#each columns as column}
						{#if column.Title == 'Title'}
							<td class="text-black-700 w-min">Μονάδες</td>
						{:else if column.Title == 'weight'}
							{#if tableOptions.ratios.visible}
								<td>%</td>
							{:else}
								<td>kg</td>
							{/if}
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
					{#if linear}
						<td>
							<input type="number" bind:value={feed.price} step="0.5" min="0" />
						</td>
					{/if}
					<td>
						<span class="w-min text-gray-500 text-sm">{feed.Title}</span>
					</td>
					<td
						>{#if edit}
							{#if tableOptions.ratios.visible}
								<div class="flex justify-between">
									<div class={totalRatio.weight != 100 ? 'mx-auto' : 'mx-auto'}>
										<input
											type="number"
											bind:value={feed.ratio}
											step="5"
											min="0"
											on:change={formatWeights}
										/>
									</div>
									<div
										class={totalRatio.weight != 100 ? 'block hover:cursor-pointer' : 'hidden'}
										on:click={() => {
											feed.ratio += 100 - totalRatio.weight;
										}}
									>
										<svg
											class="w-6 h-6 text-gray-800 dark:text-white"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 22 21"
										>
											<path
												d="M12.356 5.435 1.938 16.384a.5.5 0 0 0 .018.707l2.9 2.757a.5.5 0 0 0 .706-.018L15.978 8.882l-3.622-3.447Zm7.681-.819a.5.5 0 0 0-.018-.706l-2.9-2.757a.5.5 0 0 0-.707.017l-2.68 2.817 3.622 3.446 2.683-2.817Zm-2.89 12.233-1 .025-.024-1a1 1 0 1 0-2 .05l.025 1-1 .024a1 1 0 0 0 .05 2l1-.025.025 1a1 1 0 1 0 2-.05l-.025-1 1-.024a1 1 0 1 0-.05-2h-.001ZM2.953 9.2l.025 1a1 1 0 1 0 2-.05l-.025-1 1-.025a1 1 0 1 0-.05-2l-1 .025-.025-1a1 1 0 0 0-2 .049l.025 1-1 .025a1 1 0 0 0 .05 2l1-.024Zm15.07 2.626-2 .05.05 1.999 2-.05-.05-1.999ZM11.752.978l-2 .05.05 2 2-.05-.05-2Zm-2.95 2.075-2 .05.05 1.999 2-.05-.05-2ZM5.753 1.127l-1.999.05.05 2 1.999-.05-.05-2Zm15.194 7.625-2 .05.05 2 2-.05-.05-2Zm.125 4.998-2 .05.05 2 2-.05-.05-2Z"
											/>
										</svg>
									</div>
								</div>
							{:else}
								<input
									type="number"
									bind:value={feed.weight}
									step="1"
									min="0"
									on:change={formatRatios}
								/>
							{/if}
						{:else}
							{#if tableOptions.ratios.visible}
								<p>{feed.ratio}</p>
							{:else}
								<p>{feed.weight}</p>
							{/if}
						{/if}</td
					>

					{#each columns as column}
						{#if column.Title != 'Title' && column.Title != 'weight'}
							<td>
								<p>{formatNumber(feed[column.Title])}</p>
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			{#if tableOptions.displayPercentage.visible}
				<tr class="bg-gray-200 text-gray-700">
					{#if linear}
						<td class=" w-min text-sm" />
					{/if}
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
			{#if tableOptions.displayDMPercentage.visible}
				<tr class="bg-gray-200 text-gray-700">
					{#if linear}
						<td class=" w-min text-sm" />
					{/if}
					<td class=" w-min text-sm">Ποσοστό / ΞΟ </td>
					<td />
					{#each columns as column}
						{#if column.Title != 'Title' && column.Title != 'weight'}
							{#if column.units == 'g/kg'}
								<td class="font-bold">{formatNumber((100 * sum[column.Title]) / sum.DryMatter)}</td>
							{:else}
								<td />
							{/if}
						{/if}
					{/each}
				</tr>
			{/if}
			{#if tableOptions.ratios.visible}
				<tr class="bg-gray-300 text-gray-700 text-lg">
					{#if linear}
						<td class=" w-min" />
					{/if}
					<td class=" w-min">Σύνολο</td>

					{#each columns as column}
						{#if column.Title != 'Title'}
							<td class="font-bold {totalRatio.weight > 100 ? 'text-red-600' : ''}"
								>{formatNumber(totalRatio[column.Title])}</td
							>
						{/if}
					{/each}
				</tr>
				<tr class="bg-gray-300 text-gray-700">
					{#if linear}
						<td class=" w-min">{formatNumber(sum.price) || ''}</td>
					{/if}
					<td class=" w-min">Σύνολο (βάρος)</td>

					{#each columns as column}
						{#if column.Title == 'weight'}
							<td
								><input
									type="number"
									on:change={formatWeights}
									min="0"
									step="10"
									bind:value={totalWeight}
								/>(kg)</td
							>
						{:else if column.Title != 'Title'}
							<td class="font-bold">{formatNumber(totalWeight * totalRatio[column.Title])}</td>
						{/if}
					{/each}
				</tr>
			{:else}
				<tr class="bg-gray-300 text-gray-700 text-lg">
					{#if linear}
						<td class=" w-min">{formatNumber(sum.price) || ''}</td>
					{/if}
					<td class=" w-min">Σύνολο</td>

					{#each columns as column}
						{#if column.Title != 'Title'}
							<td class="font-bold">{formatNumber(sum[column.Title])}</td>
						{/if}
					{/each}
				</tr>
			{/if}

			{#if Object.keys(requirements).length > 0}
				<tr class="bg-gray-300 mt-2 text-gray-700 text-lg">
					<td />
					{#each columns as column}
						{#if column.Title == 'Title'}
							<td class=" w-min">Απαιτήσεις</td>
						{:else if requirements.hasOwnProperty(column.Title)}
							<td class="font-bold">{requirements[column.Title]}</td>
						{:else}
							<td />
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
	th {
		background-color: aqua;
		border: 1px dotted black;
	}
	td {
		border: 1px dotted black;
		background-color: paleturquoise;
	}

	input[type='number'] {
		background-color: paleturquoise;
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
