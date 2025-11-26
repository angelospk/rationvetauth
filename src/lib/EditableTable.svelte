<script lang="ts">
	import FeedsTable from './FeedsTable.svelte';

	import TableEditButtons from './TableEditButtons.svelte';

	import { normalizeGreek } from './greekfuncts';
	import {
		AccordionItem,
		Accordion,
		type AutocompleteOption,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { appState } from '$lib/stores/data.svelte';
	import { authState, pb } from '$lib/pocketbase.svelte';
	import type {
		AnimalReqs,
		Column,
		Feed,
		FeedConstraint,
		State,
		TableState
	} from '$lib/stores/types';
	import TablePlaceHolder from '$lib/TablePlaceHolder.svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { SlideToggle, type ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	import { formatNumber } from './greekfuncts';
	import type { Snapshot } from '../routes/$types';
	import solveLP from './testSolver';
	import { fade, fly, blur } from 'svelte/transition';

	let {
		rationName = $bindable(''),
		producerName = $bindable(''),
		linear = false,
		requirementsString = $bindable({} as Record<string, any>),
		requirements = { reqs: [], fractions: {} },
		stage2Read = {
			rationName: '',
			producerName: '',
			totalWeight: 0,
			tableState: { selfeeds: [], extraCols: [] }
		},
		test = $bindable(false),
		currentState = $bindable({
			rationName: '',
			producerName: '',
			totalWeight: 0,
			tableState: { selfeeds: [], extraCols: [] }
		}),
		ratiosSelected = $bindable(false)
	} = $props();

	export const snapshot: Snapshot = {
		capture: () => currentState,
		restore: (value) => (currentState = value)
	};
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'Δεν μπόρεσε να φορτωθεί μια τροφή (ήταν τροφή κάποιου χρήστη).',
		timeout: 3000
	};

	let totalWeight = $state(100);

	let solved = $state(false);
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

	let inputmlist = $state<string[]>([]);

	$effect(() => {
		if (Object.keys(requirementsString).length > 0) {
			const c = appState.metrics.map((x) => x.Title);
			let newList = [];
			const reqs = requirementsString as Record<string, any>;
			for (let key in reqs) {
				if (c.includes(key) && !certain.includes(key)) {
					newList.push(key);
				}
			}
			inputmlist = newList; //Reassignment triggers reactivity
		}
	});

	// let ratiosSelected = $state(false); // received as prop
	let inputChipList = $state<string[]>([]);
	let inputChipListUser = $state<string[]>([]);

	let columns = $derived(appState.metrics.filter((x) => certain.includes(x.Title) || inputmlist.includes(x.Title)));

	let selected = $derived([
		...appState.feeds.filter((x) => inputChipList.includes(x.Title)),
		...appState.userFeeds.filter((x) => inputChipListUser.includes(x.Title))
	]);

	let feedConstraints = $state<FeedConstraint[]>([]);

	$effect(() => {
		feedConstraints = [...appState.userFeeds, ...appState.feeds].map((x) => {
			if (x.Title) return { Title: x.Title, has: false };
		}).filter(x => x !== undefined) as FeedConstraint[];
	});

	let minimalSelected = $derived(!ratiosSelected
		? selected.map((item) => {
				if (item.user) {
					return { id: item.id, weight: item.weight, public: false, mix: item.mix || false };
				} else {
					return { Title: item.Title, weight: item.weight, public: true };
				}
		  })
		: selected.map((item) => {
				if (!appState.feeds.map((x) => x.id).includes(item.id)) {
					if (appState.userFeeds.map((x) => x.id).includes(item.id))
						return { id: item.id, ratio: item.ratio, public: false, mix: false };
					else return { id: item.id, ratio: item.ratio, mix: true, public: false };
				} else {
					return { Title: item.Title, ratio: item.ratio, public: true };
				}
		  }));

	$effect(() => {
		currentState = {
			rationName: rationName,
			producerName: producerName,
			totalWeight: totalWeight,
			tableState: { selfeeds: minimalSelected, extraCols: inputmlist, ratios: ratiosSelected }
		};
	});

	let waitingtoLoadState = true;

	async function convertRationMixtoFeed(ration: State) {
		// async function convertRationMixtoFeed(ration: State): Promise<Feed> {
		let selectedMixFeeds: Feed[] = [];
		let publicFeeds: Feed[] = ration.tableState.selfeeds.filter((x) => x.public);
		publicFeeds.forEach((item) => {
			const feedItem = appState.feeds.find((feed) => feed.Title === item.Title);
			if (feedItem) {
				feedItem.ratio = ration.tableState.ratios
					? item.ratio
					: item.weight || 0 / ration.totalWeight;
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
			const feedItem = appState.userFeeds.find((feed) => feed.id === item.id);
			if (feedItem) {
				feedItem.ratio = ration.tableState.ratios
					? item.ratio
					: item.weight || 0 / ration.totalWeight;
				selectedMixFeeds.push(feedItem);
			} else {
				if (item.id) foods2Fetch.push(item.id);
			}
		});
		let fetchedFeeds: Feed[] = [];
		if (foods2Fetch.length > 0) {
			foods2Fetch.forEach(async (id) => {
				try {
					const feched = await pb.collection('feeds').getOne(id);
					fetchedFeeds.push(feched);
				} catch (error) {
					console.log('error fetching feeds', error);
				}
			});
		}
		if (fetchedFeeds && fetchedFeeds.length > 0 && uFeedsRead && uFeedsRead.length > 0) {
			fetchedFeeds.forEach((item) => {
				const found = uFeedsRead.find((x) => x.id == item.id);
				if (found) {
					found.ratio = ration.tableState.ratios
						? item.ratio || 0
						: item.weight || 0 / ration.totalWeight;
					selectedMixFeeds.push(item);
				}
			});
		}
		let mixFeeds: Feed[] = ration.tableState.selfeeds.filter((x) => !x.public && x.mix);
		mixFeeds.forEach(async (item) => {
			try {
				const rationMix: State = await pb.collection('rations').getOne(item.id);
				const userFeedItem = await convertRationMixtoFeed(rationMix);
				userFeedItem.ratio = ration.tableState.ratios
					? item.ratio || 0
					: item.weight || 0 / ration.totalWeight;
				// might need to update feed weights or ratios here
				selectedMixFeeds.push(userFeedItem);
			} catch (error) {
				console.log('Δε βρέθηκε το σιτηρέσιο στη βάση δεδομένων.', error);
				te.message = 'Δε βρέθηκε ένα σιτηρέσιο στη βάση δεδομένων.';
				te.background = 'bg-error-400';
				toastStore.trigger(te);
			}
		});

		// create a feed item
		let feed = appState.feeds[0];
		for (let x in feed) {
			if (typeof feed[x] == 'number') feed[x] = 0;
		}

		selectedMixFeeds.forEach((item) => {
			for (let x in feed) {
				if (typeof feed[x] == 'number' && x != 'weight' && x != 'ratio') {
					const r = (item.ratio || 0) > 1 ? (item.ratio || 0) / 100 : (item.ratio || 0);
					feed[x] += item[x] * r;
				}
			}
		});
		feed.Title = ration.rationName;
		feed.weight = ration.totalWeight;
		feed.ratio = 0;
		feed.id = ration.id;
		feed.mix = true;
		return feed;
	};

	async function readState(tableState: TableState) {
		for (const item of tableState.selfeeds) {
			if (item.id) {
				let userFeedItem: Feed | undefined = appState.userFeeds.find((feed) => feed.id === item.id);
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
					if (!authState.user || !itemIsByUser) {
						if (!appState.feeds.some((x) => x.id == userFeedItem?.id)) {
							appState.feeds = [...appState.feeds, userFeedItem];
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
				const feedItem = appState.feeds.find((feed) => feed.Title === item.Title);

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

	$effect(() => {
		if (appState.loadedTables && waitingtoLoadState) {
			waitingtoLoadState = false;
			let t = stage2Read?.tableState;
			producerName = stage2Read?.producerName ?? "";
			rationName = stage2Read?.rationName ?? "";
			if (t) {
				readState(t).then((r) => {
					inputChipList = r.inputChipList;
					inputChipListUser = r.inputChipListUser;
					inputmlist = r.inputmlist;
				});
			}
		}
	});

	let autocompleteOptions = $derived(appState.feeds.map((feed) => ({
		label: feed.Title || "",
		value: feed.Title || "",
		keywords: feed.keywords
			? feed.keywords.split(', ').concat(normalizeGreek(feed.Title || ""))
			: normalizeGreek(feed.Title || "")
	})) as AutocompleteOption<string, unknown>[]);

	let metricsAutocomplete = $derived(appState.metrics
		.filter((x) => !certain.includes(x.Title))
		.map((x) => ({
			label: x.labelgr || "",
			value: x.Title,
			keywords: normalizeGreek(x.labelgr || "")
		})) as AutocompleteOption<string, unknown>[]);

	let userFoodAutocomplete = $derived(appState.userFeeds.map((x) => ({
		label: x.Title || "",
		value: x.Title || "",
		keywords: normalizeGreek(x.Title || "")
	})) as AutocompleteOption<string, unknown>[]);

	let result = $state<any>();
</script>

{#if appState.feeds.length > 0 && appState.metrics.length > 0}
	<!-- selected={selected} columns={columns} -->
	{#key solved}
		<FeedsTable
			bind:selected
			bind:columns
			userFeeds={appState.userFeeds}
			feeds={appState.feeds}
			metrics={appState.metrics}
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
	currentUser={authState.user}
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

	{#if selected.length > 0 && (requirements as any).reqs.length > 0 && !test}
		<Accordion>
			<AccordionItem>
				{#snippet summary()}
					<div class="flex justify-center text-center mx-auto text-red-400">
						<p class="text-slate-100">Περιορισμοί Τροφών:</p>
					</div>
				{/snippet}
				{#snippet content()}
					<div class="flex-container place-center justify-center card p-2 mx-auto gap-2">
						{#each feedConstraints.filter((x) => inputChipList
								.concat(inputChipListUser)
								.includes(x.Title)) as cons}
							<div in:fly={{ x: 100, duration: 300 }} class="inline-flex p-2 gap-x-1">
								<SlideToggle size="sm" name="toggle" bind:checked={cons.has} />
								<p class="mr-2">{cons.Title}</p>
								{#if !cons.has}
									<div class="inline-flex" in:blur={{ amount: 5, duration: 300 }}>
										<input type="number" readonly value="0" />
										<p class="mx-1">-</p>
										<input type="number" value="100" readonly />
									</div>
								{:else}
									<div class="inline-flex" in:blur={{ amount: 5, duration: 300 }}>
										<input min="0" max="100" type="number" bind:value={cons.low} />
										<p class="mx-1">-</p>
										<input type="number" min="0" max="100" bind:value={cons.high} />
										<p class="ml-1">%</p>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/snippet}
			</AccordionItem>
		</Accordion>
		<button
			class="koumpi mb-3"
			onclick={async () => {
				solved = false;
				// empty result
				result = {};

				let r = await solveLP(
					selected,
					(requirements as any).reqs,
					feedConstraints.filter((x) => inputChipList.concat(inputChipListUser).includes(x.Title))
				);
				result = r.result;
				if (result?.status && result.status == 5 || result.status==4) {
					selected.forEach((feed, i) => {
						feed.ratio = result.vars[`x${i}`];
					});
					solved=true
					solved=result.status==5?true:false||false
				} else {
					solved = false;
				}
			}}>Προσπάθεια Αυτόματης Επίλυσης<sup>2</sup></button
		>
	{:else}
		<button class="btn bg-gray-400">Προσπάθεια Αυτόματης Επίλυσης<sup>1</sup></button>
	{/if}
	{#if result != undefined}
		{#if solved}
			<div class="rounded-full bg-green-400 p-4 max-w-lg mx-auto">
				Επιτυχής επίλυση.<br />Συνολικό κόστος (για {totalWeight} κιλά): {formatNumber(result?.z) ||
					''}
			</div>
		{:else}
			<div class="p-4 bg-error-400 rounded-full max-w-lg mx-auto">
				Το σιτηρέσιο δεν μπόρεσε να επιλυθεί. Δοκιμάστε να τροποποιήσετε τις τροφές ή να χαλαρώσετε
				τις λειτουργικές απαιτήσεις ή τους περιορισμούς τροφών.
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
