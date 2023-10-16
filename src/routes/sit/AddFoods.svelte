<script lang="ts">
	import TableEditButtons from './TableEditButtons.svelte';

	// Your Svelte component
	import { onMount } from 'svelte';
	import { normalizeGreek } from '../../greekfuncts';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { metrics, feeds } from '$lib/stores/data';
	import { currentUser, pb } from '$lib/pocketbase';
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
	let names = {};
	let userFeeds = [];
	export let rationName: string;
	export let producerName: string;

	let selected = [];
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
	let tableOptions = [
		{ label: 'Εμφάνιση Μονάδων', visible: true },
		{ label: 'Εμφάνιση Ποσοστού', visible: true },
		{ label: 'Εμφάνιση Ποσοστού ανά ΞΟ', visible: false }
	];
	let columns=[];
    $: columns=$metrics.filter((x) => certain.includes(x.Title) || inputmlist.includes(x.Title));
	for (const item of $metrics) {
		names[item.Title] = item;
	}

	let sum = {};
	let emptySum;
$:{
    let tmp = $feeds[0] || {};
    if (tmp.length==0){
certain.forEach(x=>{sum[x]=0})
    }
    else{
		for (let f in tmp) {
			if (typeof tmp[f] != 'string') {
				sum[f] = 0;
			}
		}
    }
		emptySum = { ...sum };
}

	console.log('sums', sum, emptySum);
	let inputChipList: string[] = [];
	let inputChipListUser: string[] = [];
	let inputmlist: string[] = [];
	let autocompleteOptions: AutocompleteOption<string>[];
	let metricsAutocomplete: AutocompleteOption<string>[];
	let userFoodAutocomplete: AutocompleteOption<string>[];

	async function loadState() {
		const savedState = localStorage.getItem('livestockFeedState');
		if (savedState) {
			const state = JSON.parse(savedState);
			inputChipList = state.inputChipList || [];
			inputmlist = state.inputmlist || [];

			if (state.toptions) {
				tableOptions.forEach((item, index) => (item.visible = state.toptions[index] || false));
			}
			if (state.rationName) {
				rationName = state.rationName;
			}
			if (state.producerName) {
				producerName = state.producerName;
			}
			if (state.weights) {
				setTimeout(() => {
					selected.forEach((item, index) => {
						item.weight = state.weights[index] || 0;
					});
				}, 200);
			}
			console.log('loaded', state, selected);
			// Set other variables from the saved state if needed
		}
	}

	onMount(async () => {
		if ($currentUser) {
			const r: any =
				(await pb.collection('feeds').getFullList({
					sort: '-created'
				})) || [];
			const userFeedsdb = r;

			userFeeds = userFeedsdb.map((feed) => {
				const {
					collectionId,
					collectionName,
					created,
					id,
					updated,
					user,
					...rest // Get the rest of the properties
				} = feed;
				return rest;
			});

			for (let i of userFeeds) {
				i.weight = 0;
			}
			console.log('user feeds', userFeeds);
			userFoodAutocomplete = userFeeds.map((x) => ({
				label: x.Title,
				value: x.Title,
				keywords: normalizeGreek(x.Title)
			}));
		}

		await loadState();
	});
	function saveState() {
		if (selected.length > 0) {
			const toptions = tableOptions.map((x) => x.visible);
			const weights = selected.map((x) => x.weight) || [];
			const state = {
				inputChipList,
				inputmlist,
				weights,
				toptions,
				rationName,
				producerName
			};
			localStorage.setItem('livestockFeedState', JSON.stringify(state));
			console.log('Saved', state);
		}
	}
	//filtrarei ta feeds kathe fora pou allazei to inputChipList dld to koutaki pou pliktrologei o xristis
	$: selected = [
		...$feeds.filter((x) => inputChipList.includes(x.Title)),
		...userFeeds.filter((x) => inputChipListUser.includes(x.Title))
	];
	$: {
		sum = { ...emptySum }; // Reset the sum object to emptySum
		console.log(sum);
		if (selected.length > 0) {
			for (let i = 0; i < selected.length; i++) {
				sum.weight += selected[i].weight;

				for (let m in sum) {
					if (m != 'weight') {
						if (selected[i].hasOwnProperty(m)) {
							sum[m] += selected[i].weight * selected[i][m];
						} else {
							console.log(selected[i], m);
						}
					}
				}
			}
		}
		saveState();
	}

	function formatNumber(number: Number) {
		if (number == undefined) return null;
		return Number.isInteger(number) ? number.toString() : number.toFixed(2);
	}

	autocompleteOptions = $feeds.map((feed) => ({
		label: feed.Title,
		value: feed.Title,
		keywords: feed.keywords
			? feed.keywords.split(', ').concat(normalizeGreek(feed.Title))
			: normalizeGreek(feed.Title)
	}));
	$: metricsAutocomplete = $metrics
		.filter((x) => !certain.includes(x.Title))
		.map((x) => ({
			label: x.labelgr,
			value: x.Title,
			keywords: normalizeGreek(x.labelgr)
		}));
</script>

<div class="heading print:hidden">
	<h2>Βήμα 2: Εισαγωγή Τροφών</h2>
</div>
<div class="hidden print:block text-center text-lg my-3">Πίνακας Σιτηρεσίου</div>
<div class="info" style="">
	Σημείωση: Προσθέστε τροφές πατώντας στο "Αλλαγή Τροφών.<br />
</div>

<!-- Table for feedstuff entry -->
{#if $feeds.length > 0 && $metrics.length > 0}
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
	<div class="card p-4 variant-filled-secondary" data-popup="optionsClick">
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
	<div class="card p-4 variant-filled-secondary" data-popup="popupClick">
		<p class="underline">Διατροφικά στοιχεία πίνακα:</p>
		<ul>
			<li>ΞΟ = Ξηρά Ουσία</li>
			<li>ΟΛΟ = Ολικές Λιπαρές Ουσίες</li>
			<li>ΟΚ = Ολικές Κυταρρίνες</li>
			<li>Ca = Ασβέστιο</li>
			<li>P = Φωσφόρος</li>
			<li>ΟΑΟ = Ολικές Αζωτούχες Ουσίες</li>
		</ul>
		<p class="text-xs my-2">
			Στη γραμμή "Σύνολο" οι μονάδες εκτός τη στήλης "Βάρος" είναι g ή kcal αντίστοιχα.
		</p>
		<div class="arrow variant-filled-secondary" />
	</div>

	<div class="relative overflow-x-auto">
		<table class="bg-white w-full table-hover">
			<!-- Table headers -->
			<thead>
				<tr class="bg-stone-400 text-gray-700">
					{#each columns as column}
						<th class="text-primary w-min">{column.gr}</th>
					{/each}

				</tr>
				{#if tableOptions[0].visible}
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
</tr
					>
				{/if}
			</thead>

			<!-- Table body -->
			<tbody>
				{#each selected as feed, i}
					<tr class="">
						<td>
							<!-- <input type="text" readonly class="text-center" value={feed.Title} /> -->
							<span class="w-min text-gray-500 text-sm">{feed.Title}</span>
						</td>
                        <td><input type="number" bind:value={feed.weight} min="0" step="1" style="width: 3rem;"/></td>
						{#each columns as column}
							{#if column.Title != 'Title' && column.Title!="weight"}
								<!-- <td><input type="number" bind:value={feed[column.Title]} min="0" step="0.3" /></td> -->
                                <!-- <td>{feed[column.Title]}</td> -->
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

				{#if tableOptions[1].visible}
					<tr class="bg-gray-200 text-gray-700">
						<td class="text-purple-500 w-min text-sm">Ποσοστό</td>
						<td />
						{#each columns as column}
							{#if column.Title != 'Title' && column.Title != 'weight'}
								{#if column.units == 'g/kg'}
									<td class="font-bold">{formatNumber(sum[column.Title] / sum['weight'] / 10)}</td>
                                    {:else}
                                    <td></td>
								{/if}
							{/if}
						{/each}

					</tr>
				{/if}
				{#if tableOptions[2].visible}
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
                                    <td></td>
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

	<TableEditButtons
		currentUser={$currentUser}
		bind:inputChipList
		bind:inputChipListUser
		bind:inputmlist
		bind:autocompleteOptions
		bind:metricsAutocomplete
		{userFoodAutocomplete}
	/>
{:else}
	<p class="my-3">
		Οι διαθέσιμες τροφές φορτώνονται...<br />Σε περίπτωση καθυστέρησης, ξαναφορτώστε τη σελίδα.
	</p>
	<section class="card w-full">
		<div class="p-4 space-y-4">
			<div class="placeholder" />
			<div class="grid grid-cols-3 gap-8">
				<div class="placeholder" />
				<div class="placeholder" />
				<div class="placeholder" />
			</div>
			<div class="grid grid-cols-4 gap-4">
				<div class="placeholder" />
				<div class="placeholder" />
				<div class="placeholder" />
				<div class="placeholder" />
			</div>
		</div>
	</section>
{/if}

<style lang="postcss">
	.info {
		@apply my-2 bg-secondary-400 rounded-lg print:hidden;
	}
	.heading {
		font-size: x-large;
		margin-top: 1rem;
	}

	th,
	td {
		border: 1px dotted black;
	}
	@media print {
		/* Hide buttons and explanatory text */
		.btn {
			display: none;
		}
		th,
		td {
			border: 1px solid black;
		}
		.info {
			display: none;
		}
		/* Adjust table layout for printing */
	}
</style>
