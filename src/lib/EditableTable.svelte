<script lang="ts">
	import FeedsTable from './FeedsTable.svelte';

	import TableEditButtons from './TableEditButtons.svelte';

	import { normalizeGreek } from './greekfuncts';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { metrics, feeds, userFeeds, loadedTables } from '$lib/stores/data';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { AnimalReqs, Column, Feed, State, TableState } from '$lib/stores/types';
	import TablePlaceHolder from '$lib/TablePlaceHolder.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { solveLP } from './solveLinear';
	import { formatNumber } from './greekfuncts';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'Δεν μπόρεσε να φορτωθεί μια τροφή (ήταν τροφή κάποιου χρήστη).',
		timeout: 3000
	};
	export let rationName: string = '';
	export let producerName: string = '';
	export let linear = false;
	let totalWeight = 100;
	export let requirementsString = {};
	export let requirements: AnimalReqs = { reqs: [], fractions: {} };
	let solved: boolean = false;
	let certain = !linear
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
	$: {
		if (Object.keys(requirementsString).length > 0) {
			const c = $metrics.map((x) => x.Title);
			console.log(requirementsString);
			inputmlist = [];
			for (let key in requirementsString) {
				if (c.includes(key) && !certain.includes(key) && !inputmlist.includes(key)) {
					inputmlist.push(key);
				}
			}
		}
	}
	export let stage2Read: State = {
		rationName,
		producerName,
		tableState: { selfeeds: [], extraCols: [] }
	};
	let selected: Feed[] = [];
	let columns: Column[] = [];
	let minimalSelected: Feed[] = [];
	let inputChipList: string[] = [];
	let inputChipListUser: string[] = [];
	let inputmlist: string[] = [];
	let autocompleteOptions: AutocompleteOption<string>[];
	let metricsAutocomplete: AutocompleteOption<string>[];
	let userFoodAutocomplete: AutocompleteOption<string>[];
	let result: object;
	export let currentState: State = {
		rationName,
		producerName,
		tableState: { selfeeds: [], extraCols: [] }
	};
	$: {
		currentState = {
			rationName: rationName,
			producerName: producerName,
			tableState: { selfeeds: minimalSelected, extraCols: inputmlist }
		};
	}
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
	onMount(async () => {
		// certain=
		// loaded=loadState()
		// waitingtoLoadState=false;
	});

	let waitingtoLoadState = true;
	let loaded: State | null;
	async function readState(tableState: TableState) {
		// let tableState:TableState=stage2Read?.ts
		for (const item of tableState.selfeeds) {
			console.log(item);
			if (item.id && item.weight) {
				let userFeedItem = $userFeeds.find((feed) => feed.id === item.id);
				let itemIsByUser = true;
				console.log(userFeedItem, $userFeeds);
				if (!userFeedItem) {
					itemIsByUser = false;
					try {
						userFeedItem = await pb.collection('feeds').getOne(item.id, {
							expand: 'user'
						});
					} catch (err) {
						console.log(err);
						toastStore.trigger(te);
					}
				}
				if (userFeedItem) {
					userFeedItem.weight = item.weight; // Update the weight
					console.log($currentUser, itemIsByUser);
					if (!$currentUser || !itemIsByUser) {
						// Assuming you have a variable `currentUser` to check if the user is signed in
						if (!$feeds.some((x) => x.id == userFeedItem.id)) {
							$feeds = [...$feeds, userFeedItem];
						}
						if (!inputChipList.includes(userFeedItem.Title)) {
							inputChipList.push(userFeedItem.Title);
						}
					} else {
						if (!inputChipListUser.includes(userFeedItem.Title)) {
							inputChipListUser.push(userFeedItem.Title);
						}
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
			inputmlist.push(...tableState.extraCols);
		}
		// console.log(inputmlist, inputChipList, inputChipListUser);
		return { inputChipListUser, inputChipList, inputmlist };
	}

	$: {
		if ($loadedTables && waitingtoLoadState) {
			waitingtoLoadState = false;
			let t = stage2Read?.tableState;
			producerName = stage2Read?.producerName;
			rationName = stage2Read?.rationName;
			readState(t).then((r) => {
				inputChipList = r.inputChipList;
				inputChipListUser = r.inputChipListUser;
				inputmlist = r.inputmlist;
			});
		}
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
	$: userFoodAutocomplete = $userFeeds.map((x) => ({
		label: x.Title,
		value: x.Title,
		keywords: normalizeGreek(x.Title)
	}));
</script>

{#if $feeds.length > 0 && $metrics.length > 0}
	<!-- selected={selected} columns={columns} -->
	<FeedsTable
		bind:selected
		bind:columns
		userFeeds={$userFeeds}
		feeds={$feeds}
		metrics={$metrics}
		edit={true}
		bind:totalWeight
		{linear}
		bind:requirements={requirementsString}
	/>
{:else}
	<TablePlaceHolder />
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
{#if selected.length>0 && requirements.req>0}
<button
	class="koumpi mb-3"
	on:click={async () => {
		solved = false;
		
		result = solveLP(selected, requirements.reqs);
		if (result && result?.feasible) {
			solved=true;
			selected.forEach((feed, i) => {
				if (result.hasOwnProperty(`feed${i}`)) {
					feed.ratio = result[`feed${i}`] || 0;
				} else {
					feed.ratio = 0;
				}
			});
		}
	}}>Προσπάθεια Αυτόματης Επίλυσης*</button
>
{:else}
<button class="btn bg-gray-400">Προσπάθεια Αυτόματης Επίλυσης<sup>1</sup></button>
{/if}


{#if result!=undefined}
{#if solved}	
<div class="card p-4">Επιτυχής επίλυση. Συνολικό κόστος (για 100 κιλά): {formatNumber(result?.result) || ''}</div>
{:else}
<div class="p-4 bg-error-400 rounded-full">Το σιτηρέσιο δεν μπόρεσε να επιλυθεί. Δοκιμάστε να τροποποιήσετε τις τροφές ή να χαλαρώσετε τις λειτουργικές απαιτήσεις του ζώου.</div>
{/if}
{/if}



<hr class="my-3">
<p class="text-xs"><sup>1</sup>: Τα αποτελέσματα προκύπτουν μέσω  γραμμικού προγραμματισμού και χρησιμεύουν ως υπολογιστικές εκτιμήσεις. Ωστόσο δεν υποκαθιστούν τις συμβουλές των εμπειρογνωμόνων. Ο αλγόριθμος στοχεύει στην ελαχιστοποιήση του κόστους, όμως οι διακυμάνσεις στην ποιότητα των ζωοτροφών, οι συνθήκες υγείας των ζώων και άλλοι περιβαλλοντικοί παράγοντες μπορούν να επηρεάσουν σημαντικά την πραγματική αποτελεσματικότητα του σιτηρεσίου. Συνιστούμε ανεπιφύλακτα να συμβουλευτείτε εξειδικευμένους κτηνιάτρους και διατροφολόγους ζώων για να επικυρώσετε την καταλληλότητα και την ασφάλεια της προτεινόμενης σύνθεσης ζωοτροφών.</p>