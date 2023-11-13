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

	import { formatNumber } from './greekfuncts';
	import type { Snapshot } from '../routes/$types';
	import solveLP from './testSolver';
	export const snapshot: Snapshot = {
		capture: () => currentState,
		restore: (value) => (currentState = value)
	};
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
		totalWeight:0,
		tableState: { selfeeds: [], extraCols: [] }
	};
	export let test:boolean=false;
	let ratiosSelected: boolean;
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
		totalWeight:0,
		tableState: { selfeeds: [], extraCols: [] }
	};
	$: {
		currentState = {
			rationName: rationName,
			producerName: producerName,
			totalWeight: totalWeight,
			tableState: { selfeeds: minimalSelected, extraCols: inputmlist, ratios: ratiosSelected }
		};
	}
	// if (!waitingtoLoadState)saveState();

	// reactive states updating table
	$: columns = $metrics.filter((x) => certain.includes(x.Title) || inputmlist.includes(x.Title));
	$: selected = [
		...$feeds.filter((x) => inputChipList.includes(x.Title)),
		...$userFeeds.filter((x) => inputChipListUser.includes(x.Title))
	];
	$: minimalSelected = !ratiosSelected
		? selected.map((item) => {
				if (item.user) {
						return { id: item.id, weight: item.weight, public: false, mix: item.mix||false };
				} else {
					return { Title: item.Title, weight: item.weight, public: true };
				}
		  })
		: selected.map((item) => {
				if (item.id) {
					if ($userFeeds.map((x) => x.id).includes(item.id))
						return { id: item.id, ratio: item.ratio, public: false, mix: false };
					else return { id: item.id, ratio: item.ratio, mix: true, public: false };
				} else {
					return { Title: item.Title, ratio: item.ratio, public: true };
				}
		  });

	onMount(async () => {});

	let waitingtoLoadState = true;
	let loaded: State | null;
	export let convertRationMixtoFeed= async(ration:State)=>{
	// async function convertRationMixtoFeed(ration: State): Promise<Feed> {
		let selectedMixFeeds: Feed[] = [];
		let publicFeeds: Feed[] = ration.tableState.selfeeds.filter((x) => x.public);
		publicFeeds.forEach((item) => {
			const feedItem = $feeds.find((feed) => feed.Title === item.Title);
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
			const feedItem = $userFeeds.find((feed) => feed.id === item.id);
			if (feedItem) {
				feedItem.ratio =ration.tableState.ratios?item.ratio:item.weight||0/ration.totalWeight;
				selectedMixFeeds.push(feedItem);
			} else {
				if (item.id) foods2Fetch.push(item.id);
			}
		});
		let fetchedFeeds:Feed[]=[];
		if (foods2Fetch.length > 0) {
			foods2Fetch.forEach(async id=>{
				try {
					const feched=await pb.collection('feeds').getOne(id)
					fetchedFeeds.push(feched)
				} catch (error) {
					console.log('error fetching feeds', error);
				}
			})
			// try {
			// 	fetchedFeeds = await pb.collection('feeds').getList(1, 50, {
			// 		filter: `id=('${foods2Fetch.join("'||id='")}')`
			// 	});
			// 	console.log('fetched feeds', fetchedFeeds);
			// } catch (error) {
			// 	console.log('error fetching feeds', error);
			// }
		}
		if (fetchedFeeds && fetchedFeeds.length > 0 && uFeedsRead && uFeedsRead.length > 0) {
			fetchedFeeds.forEach((item) => {
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
		let feed=$feeds[0]
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

	async function readState(tableState: TableState) {
		// let publicFeeds: Feed[] =tableState.selfeeds.filter((x) => x.public);
		// publicFeeds.forEach((item) => {
		// 	const feedItem = $feeds.find((feed) => feed.Title === item.Title);
		// 	if (feedItem) {
		// 		//weights or ratios?
		// 		feedItem.weight = item.weight; // Update the weight
		// 		// feedItem.ratio = ration.tableState.ratios?item.ratio:item.weight||0/ration.totalWeight;
		// 		inputChipList.push(feedItem.Title);
		// 	} else {
		// 		//no public food found
		// 		console.log(`Δε βρέθηκε η τροφή ${item.Title} στη βάση δεδομένων.`);
		// 		te.message = `Δε βρέθηκε η τροφή ${item.Title} στη βάση δεδομένων.`;
		// 		te.background = 'bg-error-400';
		// 		toastStore.trigger(te);
		// 	}
		// });
		// let foods2Fetch: string[] = [];
		// let uFeedsRead: Feed[] = tableState.selfeeds.filter((x) => !x.public && !x.mix);
		// uFeedsRead.forEach((item) => {
		// 	const feedItem = $userFeeds.find((feed) => feed.id === item.id);
		// 	if (feedItem) {
		// 		feedItem.weight = item.weight; // Update the weight
		// 		// feedItem.ratio = ration.tableState.ratios?item.ratio:item.weight||0/ration.totalWeight;
		// 		inputChipListUser.push(feedItem.Title);
		// 	} else {
		// 		if (item.id) foods2Fetch.push(item.id);
		// 	}
		// });
		// let fetchedFeeds;
		// if (foods2Fetch.length > 0) {
		// 	try {
		// 		fetchedFeeds = await pb.collection('feeds').getList(1, 50, {
		// 			filter: `id=('${foods2Fetch.join("'||id='")}')`
		// 		});
		// 		console.log('fetched feeds', fetchedFeeds);
		// 	} catch (error) {
		// 		console.log('error fetching feeds', error);
		// 	}
		// }
		// if (fetchedFeeds && fetchedFeeds.items.length > 0 && uFeedsRead && uFeedsRead.length > 0) {
		// 	fetchedFeeds.items.forEach((item) => {
		// 		const found=uFeedsRead.find((x) => x.id == item.id)
		// 		if (found){
		// 		found.weight = item.weight; // Update the weight
		// 		// feedItem.ratio = ration.tableState.ratios?item.ratio||0:item.weight||0/ration.totalWeight;
		// 		inputChipListUser.push(item.Title);
		// 	}
		// 	});
		// }
		// let mixFeeds: Feed[] = tableState.selfeeds.filter((x) => !x.public && x.mix);
		// mixFeeds.forEach(async (item) => {
		// 	try {
		// 		const rationMix: State = await pb.collection('rations').getOne(item.id);
		// 		const userFeedItem = await convertRationMixtoFeed(rationMix);
		// 		userFeedItem.weight = item.weight; // Update the weight
		// 		// feedItem.ratio = ration.tableState.ratios?item.ratio||0:item.weight||0/ration.totalWeight;
		// 		$feeds = [...$feeds, userFeedItem];
		// 		inputChipList.push(userFeedItem.Title);
		// 	} catch (error) {
		// 		console.log("Δε βρέθηκε το σιτηρέσιο στη βάση δεδομένων.", error);
		// 		te.message = 'Δε βρέθηκε ένα μείγμα σιτηρεσίου στη βάση δεδομένων.';
		// 		te.background = 'bg-error-400';
		// 		toastStore.trigger(te);
		// 	}

		// });

	
		for (const item of tableState.selfeeds) {
			if (item.id) {
				let userFeedItem:Feed|undefined = $userFeeds.find((feed) => feed.id === item.id);
				let itemIsByUser = true;
				if (!userFeedItem) {
					itemIsByUser = false;
					try {
						userFeedItem = await pb.collection('feeds').getOne(item.id, {
							expand: 'user'
						});
					} catch (err) {

						if (item.mix) {
							//fortwse to ration ws trofi
							try {
								const rationMix: State = await pb.collection('rations').getOne(item.id);
								userFeedItem = await convertRationMixtoFeed(rationMix);
							} catch (error) {
								te.message = 'Δε βρέθηκε το σιτηρέσιο στη βάση δεδομένων.';
								te.background = 'bg-error-400';
								toastStore.trigger(te);
							}
						} else {
							console.log(err);
							toastStore.trigger(te);
						}
					}
				}
				if (userFeedItem && userFeedItem.Title) {
					userFeedItem.weight = item.weight; // Update the weight
					if (!$currentUser || !itemIsByUser) {
						if (!$feeds.some((x) => x.id == userFeedItem?.id)) {
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
			} else if (item.Title) {
				const feedItem = $feeds.find((feed) => feed.Title === item.Title);

				if (feedItem) {
					feedItem.weight = item.weight; // Update the weight
					inputChipList.push(item.Title); // Add to inputChipList
				}
			}
		}

		if (tableState.extraCols && tableState.extraCols.length > 0) {
			inputmlist.push(...tableState.extraCols);
		}
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
	{#key solved}
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
			bind:ratiosSelected
		/>
	{/key}
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
{#if linear}
	<div class="heading print:hidden">
		<h2>Βήμα 4: Επίλυση</h2>
	</div>
	<div class="info" style="">
		Σημείωση: Πατήστε το κουμπί τις αυτόματης επίλυσης αφού διάλεξτε τροφές και εισάγετε τις
		αντίστοιχες τιμές τους.<br />
	</div>
	{JSON.stringify($currentUser)}
	{JSON.stringify(test)}
	{#if selected.length > 0 && requirements.reqs.length > 0 && !test}
		<button
			class="koumpi mb-3"
			on:click={async () => {
				// solved=false;
				// empty result
				result = {};
				console.log('tpt');
				// const resp=await fetch("/api/compute",{ method:"POST", body:JSON.stringify({selected, requirements:requirements.reqs})})
				// const resp = await fetch('/api/compute', {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json'
				// 	},
				// 	body: JSON.stringify({ selected, requirements: requirements.reqs })
				// });
				// const d = await resp.json();
				// console.log(d);
				// // solved=true;
				// result = d;

					solveLP(selected, requirements.reqs).then((r) => {
						result = r;
						solved = true;
					});
		
			}}>Προσπάθεια Αυτόματης Επίλυσης<sup>1</sup></button
		>
	{:else}
		<button class="btn bg-gray-400">Προσπάθεια Αυτόματης Επίλυσης<sup>1</sup></button>
	{/if}

	{#if result != undefined}
		{#if solved}
			<div class="card p-4 max-w-lg mx-auto">
				Μπραβο.
				<!-- Επιτυχής επίλυση.<br />Συνολικό κόστος (για {totalWeight} κιλά): {formatNumber(
					result?.result??0
				) || ''} -->
			</div>
		{:else}
			<div class="p-4 bg-error-400 rounded-full max-w-lg mx-auto">
				Το σιτηρέσιο δεν μπόρεσε να επιλυθεί. Δοκιμάστε να τροποποιήσετε τις τροφές ή να χαλαρώσετε
				τις λειτουργικές απαιτήσεις του ζώου.
			</div>
		{/if}
	{/if}
{/if}

<style lang="postcss">
	.info {
		@apply my-2 bg-secondary-400 rounded-lg print:hidden mx-auto max-w-lg;
	}
	.heading {
		font-size: x-large;
		margin-top: 1rem;
		@apply underline;
	}
	.btn {
		@apply print:hidden;
	}
</style>
