<script lang="ts">
	import FeedsTable from '../../lib/FeedsTable.svelte';

	import TableEditButtons from './TableEditButtons.svelte';

	import { onMount } from 'svelte';
	import { normalizeGreek } from '../../greekfuncts';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { metrics, feeds, userFeeds, type State } from '$lib/stores/data';
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

	export let rationName: string;
	export let producerName: string;

	let 		selected=[{
    "Title": "Καλαμπόκι",
    "DryMatter": 870,
    "Fat": 42,
    "CrudeFiber": 22,
    "Starch": 605,
    "Ash": 13.5,
    "Calcium": 0.1,
    "Phosphorus": 2.7,
    "Potassium": 3.3,
    "Sodium": 0.1,
    "DE": 3860,
    "DEruminants": 3431,
    "MEruminants": 2898,
    "NElactose": 1.1,
    "NEmeat": 1.11,
    "NMLruminants": 1.15,
    "DEswine": 3400,
    "MEswine": 3315,
    "CEswine": 2525,
    "MEpoultry": 3300,
    "CrudeProtein": 85,
    "DCPruminants": 59,
    "DCPswine": 69,
    "Lysine": 2.5,
    "Methionine": 1.7,
    "MethiCystine": 3.9,
    "Threonine": 3.2,
    "Tryptophan": 0.6,
    "Isoleucine": 3.5,
    "Leucine": 11.3,
    "Valine": 4.6,
    "Phenylalanine": 4.5,
    "Histidine": 2.5,
    "Arginine": 4.3,
    "Glycine": 3.7,
    "Category": "cat",
    "EngTitle": "corn",
    "keywords": "καλαμποκι",
    "weight": 3
}]
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
	let columns = [];
	let minimalSelected=[];
	let inputChipList: string[] = [];
	let inputChipListUser: string[] = [];
	let inputmlist: string[] = [];
	let autocompleteOptions: AutocompleteOption<string>[];
	let metricsAutocomplete: AutocompleteOption<string>[];
	let userFoodAutocomplete: AutocompleteOption<string>[];

	// reactive states updating table
	$: columns = $metrics.filter((x) => certain.includes(x.Title) || inputmlist.includes(x.Title));
	$: selected = [
		...$feeds.filter((x) => inputChipList.includes(x.Title)),
		...$userFeeds.filter((x) => inputChipListUser.includes(x.Title))
	];
	$: minimalSelected = selected.map((item) => {
		if (item.id) {
			return { id: item.id, weight: item.weight };
		} else {
			return { Title: item.Title, weight: item.weight };
		}
	});
//onmount function to initialise
	onMount(async () => {
		// if ($currentUser) {
		// 	const r: any =
		// 		(await pb.collection('feeds').getFullList({
		// 			sort: '-created'
		// 		})) || [];
		// 	const userFeedsdb = r;

		// 	userFeeds = userFeedsdb.map((feed) => {
		// 		const {
		// 			collectionId,
		// 			collectionName,
		// 			created,
		// 			id,
		// 			updated,
		// 			user,
		// 			...rest // Get the rest of the properties
		// 		} = feed;
		// 		return rest;
		// 	});

		// 	for (let i of userFeeds) {
		// 		i.weight = 0;
		// 	}
		// 	console.log('user feeds', userFeeds);

		// }

		// await loadState();

	});

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

	const s = {
		selfeeds: [{ Title: 'Καλαμπόκι', weight: 3 }],
		options: tableOptions,
		rationName: rationName,
		producerName: producerName
	};
	const t= {selfeeds: [{ Title: 'Καλαμπόκι', weight: 3 }],
extraCols: []}
async function readState(tableState) {
		// This will hold the final list of items from both userFeeds and feeds
		// let combined = [];

		// Iterate through the given stateTable
		for (const item of tableState.selfeeds) {
			console.log('here', item, $feeds, $userFeeds);
			if (item.id && item.weight) {
				// If the item has an "id" and "weight", then find the matching item in userFeeds
				let userFeedItem = $userFeeds.find((feed) => feed.id === item.id);

				// If not found in userFeeds, fetch from pocketbase
				if (!userFeedItem) {
					userFeedItem = await pb.collection('feeds').getOne(item.id, {
						expand: 'user'
					});
				}

				// If the item is found (either in userFeeds or in pocketbase), push to the result
				if (userFeedItem) {
					selected.push({
						...userFeedItem, // Spread all properties of the userFeedItem
						weight: item.weight // Override with the weight from the stateTable
					});
				}
			} else if (item.Title && item.weight) {
				// If the item has a "Title" and "weight", then find the matching item in feeds
				const feedItem = $feeds.find((feed) => feed.Title === item.Title);

				if (feedItem) {
					selected.push({
						...feedItem, // Spread all properties of the feedItem
						weight: item.weight // Override with the weight from the stateTable
					});
				}
			}
		}
        if (tableState.extraCols && tableState.extraCols.length>0)
        {certain.push(...tableState.extraCols)}
		// if (state.rationName) {
		// 	rationName = state.rationName;
		// }
		// if (state.producerName) {
		// 	producerName = state.producerName;
		// }
		console.log(selected, certain);
		// return combined;
	}
// reactive statements to change the autocomplete buttons
	$: autocompleteOptions = $feeds.map((feed) => ({
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
	$:	userFoodAutocomplete = $userFeeds.map((x) => ({
			label: x.Title,
			value: x.Title,
			keywords: normalizeGreek(x.Title)
		}));
</script>

<div class="heading print:hidden">
	<h2>Βήμα 2: Εισαγωγή Τροφών</h2>
</div>
<div class="hidden print:block text-center text-lg my-3">Πίνακας Σιτηρεσίου</div>
<div class="info" style="">
	Σημείωση: Προσθέστε τροφές πατώντας στο "Αλλαγή Τροφών.<br />
</div>

<FeedsTable tableState={t} bind:selected bind:columns edit={true} />
<TableEditButtons
	currentUser={$currentUser}
	bind:inputChipList
	bind:inputChipListUser
	bind:inputmlist
	bind:autocompleteOptions
	bind:metricsAutocomplete
	{userFoodAutocomplete}
/>

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
