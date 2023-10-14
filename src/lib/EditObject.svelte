<script>
	export let objectData; // The JSON object retrieved from your database
	// let editedData = JSON.parse(JSON.stringify(objectData)); // Create a copy to track edits

	const saveChanges = () => {
		// Implement the logic to save changes to your database
		// You can use the 'editedData' object to send updates
		// Don't forget to validate the data and handle errors
		console.log('Saving changes...', objectData);
	};
</script>

<!-- {JSON.stringify(objectData)} -->

<form>
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
    <button class="mt-3 btn variant-filled" on:click={saveChanges}>Αποθήκευση</button>
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
      margin-bottom: 1rem;
    }
  
    input[type='number'] {
      width: 3.5rem;
    }
  </style>
