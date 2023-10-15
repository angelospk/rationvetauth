<script lang="ts">
	export let objectData: any;
	export let metrics: any;
	// The JSON object retrieved from your database
	// let editedData = JSON.parse(JSON.stringify(objectData)); // Create a copy to track edits
	import { pb } from './pocketbase';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 1000
	};

	const saveChanges = async () => {
		try {
			const record = await pb.collection('feeds').update(objectData.id, objectData);
			te.message = 'Αποθηκεύτηκε επιτυχώς!';
			toastStore.trigger(te);
		} catch (err) {
			te.message = 'Η αποθήκευση απέτυχε!';
			toastStore.trigger(te);
			console.log(err);
		}
	};
</script>


<div class="card p-1">
	<div class="flex-container">
		<div class="form-item  mx-auto">
			<p>Τίτλος:</p>
			<input class="rounded-lg" type="text" bind:value={objectData.Title} />
		</div>
				<p class="underline w-full">Βασικοί Δείκτες Χημικής Σύστασης:</p>
				{#each metrics.filter((x) => x.cat == 'Βασικοί Δείκτες Χημικής Σύστασης') as metric}
					<div class="form-item">
						<p>{metric.labelgr}:</p>
						<input
							class="rounded-lg"
							type="number"
							bind:value={objectData[metric.Title]}
							step="0.3"
							min="0"
						/>
					</div>
					<!-- {/if} -->
				{/each}
        <br/>
        <p class="underline w-full">Μέταλλα:</p>
				{#each metrics.filter((x) => x.cat == 'Μέταλλα') as metric}
					<!-- {#if key != 'user' && key != 'updated' && ke != 'created' && key != 'Title' && key != 'id' && key != 'collectionId' && key != 'collectionName'} -->
					<div class="form-item">
						<p>{metric.labelgr}:</p>
						<input
							class="rounded-lg"
							type="number"
							bind:value={objectData[metric.Title]}
							step="0.3"
							min="0"
						/>
					</div>
					<!-- {/if} -->
				{/each}
        <p class="underline w-full">Δείκτες Ενέργειας:</p>
				{#each metrics.filter((x) => x.cat == 'Δείκτες Ενέργειας') as metric}
					<div class="form-item">
						<p>{metric.labelgr}:</p>
						<input
							class="rounded-lg"
							type="number"
							bind:value={objectData[metric.Title]}
							step="0.3"
							min="0"
						/>
					</div>
					<!-- {/if} -->
				{/each}
        <p class="underline w-full">Αμινοξέα:</p>
				{#each metrics.filter((x) => x.cat == 'Αμινοξέα') as metric}
					<div class="form-item">
						<p>{metric.labelgr}:</p>
						<input
							class="rounded-lg"
							type="number"
							bind:value={objectData[metric.Title]}
							step="0.3"
							min="0"
						/>
					</div>
					<!-- {/if} -->
				{/each}
	</div>
	<button class="mt-3 btn variant-filled" on:click|preventDefault={saveChanges}>Αποθήκευση</button>
</div>

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
