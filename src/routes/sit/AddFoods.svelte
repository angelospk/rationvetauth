<script lang="ts">
	import FeedsTable from '../../lib/FeedsTable.svelte';

	import TableEditButtons from './TableEditButtons.svelte';

	import { onMount } from 'svelte';
	import { normalizeGreek } from '../../greekfuncts';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { metrics, feeds, userFeeds, loadedTables } from '$lib/stores/data';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { Column, Feed, State, TableState } from '$lib/stores/types';
	import TablePlaceHolder from '$lib/TablePlaceHolder.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	let te: ToastSettings = {
	message: 'Δεν μπόρεσε να φορτωθεί μια τροφή (ήταν τροφή κάποιου χρήστη).',
	timeout: 3000
};
	export let rationName: string;
	export let producerName: string;

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
	export let selected:Feed[]=[];
	export let columns:Column[]=[];
	let minimalSelected:Feed[]=[];
	let inputChipList: string[] = [];
	let inputChipListUser: string[] = [];
	let inputmlist: string[] = [];
	let autocompleteOptions: AutocompleteOption<string>[];
	let metricsAutocomplete: AutocompleteOption<string>[];
	let userFoodAutocomplete: AutocompleteOption<string>[];
	let currentState:State
	$: currentState= {rationName:rationName, producerName: producerName, ts:{selfeeds:minimalSelected, extraCols:inputmlist}}
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
const t:TableState = { selfeeds: [{ Title: 'Καλαμπόκι', weight: 3 },{id: "ntw7z3mfbc5j61x", weight: 5}], extraCols: ["Starch"] };
async function readState(tableState: TableState) {

    for (const item of tableState.selfeeds) {
        console.log(item)
		if (item.id && item.weight) {
            let userFeedItem = $userFeeds.find((feed) => feed.id === item.id);
			let itemIsByUser=true;
			console.log(userFeedItem, $userFeeds)
            if (!userFeedItem) {
				itemIsByUser=false;
                try{
					userFeedItem = await pb.collection('feeds').getOne(item.id, {
                    expand: 'user'
                });
            	}
				catch(err){
					console.log(err)
					toastStore.trigger(te);
					
				}
			}
            if (userFeedItem) {
                userFeedItem.weight = item.weight; // Update the weight
				console.log($currentUser , itemIsByUser)
				if (!$currentUser || !itemIsByUser) { // Assuming you have a variable `currentUser` to check if the user is signed in
                    if (!$feeds.some(x=>x.id==userFeedItem.id)){
					$feeds = [...$feeds, userFeedItem];} 
					if (!inputChipList.includes(userFeedItem.Title)){
					inputChipList.push(userFeedItem.Title);
					}
                }
				else{
				if (!inputChipListUser.includes(userFeedItem.Title)){
					inputChipListUser.push(userFeedItem.Title);}

				}


            }
        } else if (item.Title && item.weight) {
            const feedItem = $feeds.find((feed) => feed.Title === item.Title);

            if (feedItem) {
                feedItem.weight = item.weight; // Update the weight
                inputChipList.push(item.Title); // Add to inputChipList
            }
        }
    }

    if (tableState.extraCols && tableState.extraCols.length > 0) {
        // certain.push(...tableState.extraCols);
		inputmlist.push(...tableState.extraCols)
    }
	console.log(inputmlist, inputChipList, inputChipListUser);
    return { inputChipListUser, inputChipList, inputmlist };
}

$: { if($loadedTables){
	readState(t).then((r)=>{inputChipList=r.inputChipList;inputChipListUser=r.inputChipListUser; inputmlist=r.inputmlist})}
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
	Σημείωση: Προσθέστε τροφές πατώντας στο "Δημόσιες Τροφές".<br />
</div>

{#if $feeds.length > 0 && $metrics.length > 0}
<!-- selected={selected} columns={columns} -->
<FeedsTable bind:selected={selected} bind:columns={columns} userFeeds={$userFeeds} feeds={$feeds} metrics={$metrics} edit={true} />
{:else}
<TablePlaceHolder></TablePlaceHolder>
{/if}

<TableEditButtons
	currentUser={$currentUser}
	bind:inputChipList
	bind:inputChipListUser
	bind:inputmlist
	bind:autocompleteOptions
	bind:metricsAutocomplete
	bind:userFoodAutocomplete
/>
{JSON.stringify(currentState)}
<style lang="postcss">
	.info {
		@apply my-2 bg-secondary-400 rounded-lg print:hidden;
	}
	.heading {
		font-size: x-large;
		margin-top: 1rem;
	}

	@media print {
		/* Hide buttons and explanatory text */
		.info {
			display: none;
		}
		/* Adjust table layout for printing */
	}
</style>
