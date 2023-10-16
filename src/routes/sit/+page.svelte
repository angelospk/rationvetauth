<script lang="ts">
  import SaveShare from './SaveShare.svelte';

  import AddFoods from './AddFoods.svelte';

  import GeneralInfo from './GeneralInfo.svelte';

	// Your Svelte component
	import { onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';

	let rationName = '';
	let producerName = '';
	let currentDate:string;

	let feeds = [];
	let metrics = [];


	onMount(async () => {
		let d = await fetch('/api/data');
		if (d.ok) {
			let dat = await d.json();
			feeds = dat.d[0].data;
			for (let i of feeds) {
				i.weight = 0;
			}
			console.log('feeds:', feeds);
			metrics = dat.d[1].data;
	console.log("metrics:", metrics);
			
		}
		
	});


	
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

<style lang="postcss">
	.info {
		@apply my-2 bg-secondary-400 rounded-lg print:hidden;
	}
	.heading {
		font-size: x-large;
		margin-top: 1rem;
	}
	input[type='number'] {
		width: 3.5rem;
	}
	@media print {
		/* Hide buttons and explanatory text */
		.btn {
			display: none;
		}
		.info {
			display: none;
		}
		/* Adjust table layout for printing */
	}
</style>
