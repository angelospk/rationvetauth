<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import EditObject from '$lib/EditObject.svelte';
	import { metrics, userFeeds as records } from '$lib/stores/data';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	// writable;
	// let records = writable([]);
	onMount(async () => {
		if ($records.length==0){
		const r:any=await pb.collection('feeds').getFullList({
				sort: '-created'
		}) || [];
		console.log(r)
        records.set(r)}
	});
	function createEmpty() {
		let empty = {};
		for (let x of m) {
			empty[x.Title] = 0;
		}
		empty.Title = '';
		return empty;
	}
	let m: any =[]
	let empty ;
	$: {m=$metrics.filter((x) => x.cat);
	empty=createEmpty()}
	
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 1000
	};

	const saveChanges = async () => {
		try {
			empty.user = $currentUser.id;
			const record = await pb.collection('feeds').create(empty);
			console.log('epistrofi:', record);
			try {
				records.update((arr) => [record,...arr]);
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

{#if !$currentUser}
	Δεν είσαι συνδεδεμένος!
{:else}
	<h1 class="font-bold mb-3">Οι Τροφές μου</h1>

	{#if !records}
		<p>loading data</p>
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
							{da.Title}
							<div class="text-xs">{da.updated}</div>
						</div></svelte:fragment
					>
					<svelte:fragment slot="content"
						><EditObject
							bind:objectData={da}
							metrics={m}
							bind:records={$records}
						/></svelte:fragment
					>
				</AccordionItem>
			{/each}

			<!-- ... -->
		</Accordion>

		<!-- <div>{JSON.stringify(data)}</div> -->
		<Accordion
			><AccordionItem>
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
							d="M13 8h6m-3 3V5m-6-.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
						/>
					</svg></svelte:fragment
				>
				<svelte:fragment slot="summary">Φτιάξε Νέα Τροφή!</svelte:fragment>
				<svelte:fragment slot="content"
					><div class="card p-1">
						<div class="flex-container">
							<div class="form-item mx-auto">
								<p>Τίτλος:</p>
								<input class="rounded-lg" type="text" bind:value={empty.Title} />
							</div>
							<p class="underline w-full">Βασικοί Δείκτες Χημικής Σύστασης:</p>
							{#each m.filter((x) => x.cat == 'Βασικοί Δείκτες Χημικής Σύστασης') as metric}
								<div class="form-item">
									<p>{metric.labelgr}:</p>
									<input
										class="rounded-lg"
										type="number"
										bind:value={empty[metric.Title]}
										step="0.3"
										min="0"
									/>
								</div>
								<!-- {/if} -->
							{/each}
							<br />
							<p class="underline w-full">Μέταλλα:</p>
							{#each m.filter((x) => x.cat == 'Μέταλλα') as metric}
								<!-- {#if key != 'user' && key != 'updated' && ke != 'created' && key != 'Title' && key != 'id' && key != 'collectionId' && key != 'collectionName'} -->
								<div class="form-item">
									<p>{metric.labelgr}:</p>
									<input
										class="rounded-lg"
										type="number"
										bind:value={empty[metric.Title]}
										step="0.3"
										min="0"
									/>
								</div>
								<!-- {/if} -->
							{/each}
							<p class="underline w-full">Δείκτες Ενέργειας:</p>
							{#each m.filter((x) => x.cat == 'Δείκτες Ενέργειας') as metric}
								<div class="form-item">
									<p>{metric.labelgr}:</p>
									<input
										class="rounded-lg"
										type="number"
										bind:value={empty[metric.Title]}
										step="0.3"
										min="0"
									/>
								</div>
								<!-- {/if} -->
							{/each}
							<p class="underline w-full">Αμινοξέα:</p>
							{#each m.filter((x) => x.cat == 'Αμινοξέα') as metric}
								<div class="form-item">
									<p>{metric.labelgr}:</p>
									<input
										class="rounded-lg"
										type="number"
										bind:value={empty[metric.Title]}
										step="0.3"
										min="0"
									/>
								</div>
								<!-- {/if} -->
							{/each}
						</div>
						<button class="mt-3 btn variant-filled" on:click|preventDefault={saveChanges}
							>Αποθήκευση</button
						>
					</div></svelte:fragment
				>
			</AccordionItem></Accordion
		>
	{/if}

	<!-- <p class="btn variant-filled"></p> -->
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

	input[type='number'] {
		width: 3.5rem;
	}
</style>
