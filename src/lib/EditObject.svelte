<script lang="ts">
	export let objectData:any; // The JSON object retrieved from your database
	// let editedData = JSON.parse(JSON.stringify(objectData)); // Create a copy to track edits
import { pb } from "./pocketbase";
import { getToastStore } from '@skeletonlabs/skeleton';
import type { ToastSettings } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	let te: ToastSettings = {
	message: 'This message will auto-hide after 3 seconds.',
	timeout: 1000
};
	const saveChanges = async () => {
    
    try{
    const record=await pb.collection('feeds').update(objectData.id, objectData);
    te.message="Αποθηκεύτηκε επιτυχώς!"
    toastStore.trigger(te)
    }
    catch (err){
      te.message="Η αποθήκευση απέτυχε!"
      toastStore.trigger(te)
      console.log(err)
    }
	};
</script>

<!-- {JSON.stringify(objectData)} -->

<form class="card p-1" on:submit|preventDefault>
    <div class="flex-container">
        <div class="form-item">
            <label>Τίτλος:</label>
            <input type="text" bind:value={objectData.Title}/>
        </div>  
      {#each Object.keys(objectData) as key (key)}
      {#if key != 'user' && key != 'updated' && key != 'created' && key != 'Title' && key != 'id' && key != 'collectionId' && key != 'collectionName'}
          <div class="form-item">
            <label>{key}:</label>
            <input type="number" bind:value={objectData[key]} step="0.3" min="0" />
          </div>
        {/if}
      {/each}
    </div>
    <button class="mt-3 btn variant-filled" on:click|preventDefault={saveChanges}>Αποθήκευση</button>
  </form>
  
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
