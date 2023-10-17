<script lang="ts">
	export let objectData: any;
	export let metrics: any;
	// The JSON object retrieved from your database
	// let editedData = JSON.parse(JSON.stringify(objectData)); // Create a copy to track edits
	import { pb } from './pocketbase';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
  import { getModalStore } from '@skeletonlabs/skeleton';
  import type { ModalSettings } from '@skeletonlabs/skeleton';

const modalStore = getModalStore();
const modal: ModalSettings = {
	type: 'confirm',
	// Data
	title: 'Παρακαλώ Επιβεβαιώστε για Διαγραφή',
	body: 'Αφού διαγραφεί η τροφή, δεν θα μπορούν να εμφανίζονται σωστά οι πίνακες διαμόρφωση σιτηρεσίων που τη χρησιμοποιούν. Είστε σίγουροι ότι θέλετε να τη διαγράψετε;',
  buttonTextConfirm:'Επιβεβαίωση',
  buttonTextCancel:'Ακύρωση',
	// TRUE if confirm pressed, FALSE if cancel pressed
	response: async (r: boolean) =>{
    if (r){
    try{
    const record= await pb.collection('feeds').delete(objectData.id)
    records=records.filter(x=>x.id!=objectData.id)
    te.message = 'Διαγράφτηκε!';
		toastStore.trigger(te);
  }
  catch (err) {
			te.message = 'Η διαγραφή απέτυχε!';
			toastStore.trigger(te);
			console.log(err);
		}}
  },
};
  export let records;
  let record=objectData
  $:objectData=record
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 1000,

	};
async function del(){
  console.log(modal)
modalStore.trigger(modal);

}
  async function test(){
  
  }
	const saveChanges = async () => {
		try {
			record = await pb.collection('feeds').update(objectData.id, objectData);
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
		<div class="form-item mx-auto flex justify-between">
      <div class="flex w-">
          <p>Τίτλος:</p>
          <input class="rounded-lg" type="text" bind:value={objectData.Title} />
      </div>
      <button class="sm:ml-3" on:click={del}>
          <svg class="w-6 h-6 text-red-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
          </svg>
        </button>
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
