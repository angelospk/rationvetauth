<script lang="ts">
	import FeedsTable from './FeedsTable.svelte';

	import TableEditButtons from './TableEditButtons.svelte';

	import { normalizeGreek } from '../greekfuncts';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
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
	export let rationName: string="";
	export let producerName: string="";

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
    export let stage2Read:State={rationName, producerName, tableState:{selfeeds:[],extraCols:[]}}
	let selected:Feed[]=[];
	let columns:Column[]=[];
	let minimalSelected:Feed[]=[];
	let inputChipList: string[] = [];
	let inputChipListUser: string[] = [];
	let inputmlist: string[] = [];
	let autocompleteOptions: AutocompleteOption<string>[];
	let metricsAutocomplete: AutocompleteOption<string>[];
	let userFoodAutocomplete: AutocompleteOption<string>[];
	export let currentState:State={rationName, producerName, tableState:{selfeeds:[],extraCols:[]}}
	$: {currentState= {rationName:rationName, producerName: producerName, tableState:{selfeeds:minimalSelected, extraCols:inputmlist}};}
// if (!waitingtoLoadState)saveState();

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

// $: {
// 	readState(stage2Read).then((r)=>{certain=r.certain;selected=r.selected})
// }

//onmount function to initialise
// onMount(async () => {
	
// 	loaded=loadState()
// 	// waitingtoLoadState=false;
// 	});

// 	function loadState() {
// 		const savedState = localStorage.getItem('livestockFeedState');
// 		console.log(savedState)
// 		if (savedState) {
// 			return JSON.parse(savedState)
// 			// Set other variables from the saved state if needed
// 		}
// 		else return null;
// 	}


// 	function saveState() {
// 			localStorage.setItem('livestockFeedState', JSON.stringify(currentState));
// 			console.log('Saved', currentState);
// 	}
	
	//filtrarei ta feeds kathe fora pou allazei to inputChipList dld to koutaki pou pliktrologei o xristis


let waitingtoLoadState=true;
let loaded:State|null;
async function readState(tableState:TableState) {
    // let tableState:TableState=stage2Read?.ts
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
	// console.log(inputmlist, inputChipList, inputChipListUser);
    return { inputChipListUser, inputChipList, inputmlist };
}

$: { if($loadedTables && waitingtoLoadState){
	// console.log(loaded)
	// let t;
	// if (loaded){
	// 	console.log("loaded", loaded)
	// 	t=loaded?.ts;
	// 	producerName=loaded?.producerName
	// 	rationName=loaded?.rationName
	// 	if (t) readState(t).then((r)=>{inputChipList=r.inputChipList;inputChipListUser=r.inputChipListUser; inputmlist=r.inputmlist; waitingtoLoadState=false;})}
	// }
	waitingtoLoadState=false;
    let t=stage2Read?.tableState
    producerName=stage2Read?.producerName;
    rationName=stage2Read?.rationName;
    readState(t).then((r)=>{inputChipList=r.inputChipList;inputChipListUser=r.inputChipListUser; inputmlist=r.inputmlist;	})}
	
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



