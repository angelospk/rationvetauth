<script lang="ts">
	import SaveShare from './SaveShare.svelte';

	import EditableTable from '$lib/EditableTable.svelte';

	import GeneralInfo from './GeneralInfo.svelte';

	// Your Svelte component
	import { currentUser } from '$lib/pocketbase';

	let rationName = '';
	let producerName = '';
	let currentDate: string;
</script>

<div class="hide-scrollbar">
	<div class="print:hidden">
		<h2 class="text-2xl md:text-4xl lg:text-5xl font-bold mb-5">Υπολογισμός Σιτηρεσίου</h2>
		<hr />
	</div>
	<form id="FeedRationForm" on:submit|preventDefault>
		<GeneralInfo bind:rationName bind:producerName bind:currentDate />

		<hr />

		<div class="heading print:hidden">
			<h2>Βήμα 2: Εισαγωγή Τροφών</h2>
		</div>
		<div class="hidden print:block text-center text-lg my-3">Πίνακας Σιτηρεσίου</div>
		<div class="info" style="">
			Σημείωση: Προσθέστε τροφές πατώντας στο "Δημόσιες Τροφές".<br />
		</div>

		<EditableTable bind:rationName bind:producerName />
		<SaveShare currentUser={$currentUser} />
	</form>
</div>
