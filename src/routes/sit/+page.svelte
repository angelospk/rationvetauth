<script lang="ts">
  import SaveShare from './SaveShare.svelte';

  import AddFoods from './AddFoods.svelte';

  import GeneralInfo from './GeneralInfo.svelte';

	// Your Svelte component
	import { currentUser } from '$lib/pocketbase';

	let rationName = '';
	let producerName = '';
	let currentDate:string;



	
</script>

<div class="hide-scrollbar">
	<div class="print:hidden">
		<h2 class="text-2xl md:text-4xl lg:text-5xl font-bold mb-5">Υπολογισμός Σιτηρεσίου</h2>
		<hr />
	</div>
	<form id="FeedRationForm" on:submit|preventDefault>
		<GeneralInfo bind:rationName={rationName} bind:producerName={producerName} bind:currentDate={currentDate}/>
		<hr />

	<AddFoods   bind:rationName={rationName} bind:producerName={producerName}/>
	<SaveShare currentUser={$currentUser}/>
	</form>
</div>

