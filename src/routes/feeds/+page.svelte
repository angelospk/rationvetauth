<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import {
		Accordion,
		AccordionItem,
		Avatar,
		RadioGroup,
		RadioItem,
		SlideToggle,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import EditObject from '$lib/EditObject.svelte';
	import { metrics, userFeeds as records } from '$lib/stores/data';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { Feed } from '$lib/stores/types';
	import FeedDetails from '$lib/FeedDetails.svelte';
	import LoadingCircles from '$lib/Loading Circles.svelte';
	import { Popover, Button } from 'flowbite-svelte';
	// writable;
	// let records = writable([]);
	const modalStore = getModalStore();
	// let selectedFeed:Feed;
	const modal: ModalSettings = {
		type: 'component',
		body: 'Επέλεξε από τη λίστα τροφή για να φορτωθεί ως πρότυπο!',
		component: 'modalTrofes',
		response(r) {
			console.log(r);
			empty = r;
		},
		buttonTextCancel: 'Ακύρωση'
		// backdropClasses: "!blur-1"
	};
	onMount(async () => {
		if ($records.length == 0) {
			const r: any =
				(await pb.collection('feeds').getFullList({
					sort: '-created'
				})) || [];
			console.log(r);
			records.set(r);
		}
	});
	function createEmpty() {
		let empty:Feed = {};
		for (let x of m) {
			empty[x.Title] = 0;
		}
		empty.Title = '';
		return empty;
	}
	let m: any = [];

	$: {
		m = $metrics.filter((x) => x.cat);
	}

	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 1000
	};
	let detailed:boolean=true;
	let empty: Feed = createEmpty();
	const saveChanges = async () => {
		try {
			empty.user = $currentUser?.id;
			const record = await pb.collection('feeds').create(empty);
			console.log('epistrofi:', record);
			try {
				records.update((arr) => [record, ...arr]);
				empty = createEmpty();
			} catch (err) {
				console.log(err);
			}
			te.message = 'Αποθηκεύτηκε επιτυχώς!';
			toastStore.trigger(te);
		} catch (err) {
			te.message = 'Η αποθήκευση απέτυχε!';
			toastStore.trigger(te);
			console.log(err);
		}
	};
</script>
<Popover triggeredBy="#as" class="p-1 text-xs bg-gradient-to-b from-transparent to-error-300 shadow-lg z-10  ">
	<div class="">
		<p class="text-black">Εμφάνιση πλήρους ονόματος ή συντομογραφίας των χημικών συστάσεων</p>
	</div>
  </Popover>
	<div class="flex justify-between mb-4">
		<h1 class="font-bold mb-3 mx-auto ">Οι Τροφές μου</h1>
		<div class="" id="as"><label class="flex items-center space-x-2 card p-2 text-xs">
			<input class="checkbox" type="checkbox" bind:checked={detailed} />
			<p>Αναλυτική Σύσταση</p>
		</label></div>
		
	</div>
	{#if !records}
	<LoadingCircles/>
	{:else}
		<Accordion>
			{#each $records as da}
				<AccordionItem>
					<svelte:fragment slot="lead"
						><svg
							class="w-6 h-6 text-gray-800 dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 18"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4.109 17H1v-2a4 4 0 0 1 4-4h.87M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm7.95 2.55a2 2 0 0 1 0 2.829l-6.364 6.364-3.536.707.707-3.536 6.364-6.364a2 2 0 0 1 2.829 0Z"
							/>
						</svg></svelte:fragment
					>
					<svelte:fragment slot="summary"
						><div class="flex justify-between">
							{da?.Title}
							<div class="text-xs">{da.updated}</div>
						</div></svelte:fragment
					>
					<svelte:fragment slot="content"
						><EditObject
							detailed={detailed}
							bind:objectData={da}
							metrics={m}
							bind:records={$records}
						/></svelte:fragment
					>
				</AccordionItem>
				
			{/each}
			<hr />
			<AccordionItem>
				<svelte:fragment slot="lead"
					><svg
						class="w-6 h-6 text-gray-800 dark:text-white "
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 18"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 8h6m-3 3V5m-6-.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
						/>
					</svg></svelte:fragment
				>
				<svelte:fragment slot="summary">Φτιάξε Νέα Τροφή!</svelte:fragment>
				<svelte:fragment slot="content"
					><div class="card p-3">
						<div class="flex-container">
							<div class="flex justify-center w-full"> <button
								class="koumpi mt-2 " id="b2"
								on:click={() => {
									modalStore.trigger(modal);
								}}>Πρότυπο τροφής</button
							>
							<button class="sm:ml-3" on:click={()=>{empty=createEmpty()}}>
								
								<svg
									class="w-6 h-6 text-red-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 18 20"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
									/>
								</svg>
							</button></div>
							<Popover triggeredBy="#b2" class="p-2 bg-gradient-to-b from-transparent to-error-300 shadow-lg border-0 ">
								<div class="">
									<p class="text-black">Βάλε μια από τις γνωστές τροφές ως πρότυπο!</p>
								</div>
							  </Popover>
							<div class="form-item mx-auto sm:mx-0 sm:mr-3">
								<p>Τίτλος:</p>
								<input class="rounded-lg ml-1" type="text" bind:value={empty.Title} />
							</div>
						<FeedDetails detailed={detailed} metrics={m} bind:objectData={empty}/>
						<button class="my-3 koumpi" on:click|preventDefault={saveChanges}
							>Αποθήκευση</button
						>
					</div></svelte:fragment
				>
			</AccordionItem>
			<!-- ... -->
		</Accordion>

		<!-- <div>{JSON.stringify(data)}</div> -->
		
	{/if}

<style>
	.flex-container {
		display: flex;
		flex-wrap: wrap; /* Allow items to wrap to a new line */
		gap: 1rem; /* Adjust the gap between items */
	}

	.form-item {
		display: flex;
		align-items: center;
	}

</style>
