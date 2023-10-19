<script lang="ts">

	import EditableTable from '$lib/EditableTable.svelte';
	import { Accordion,  AccordionItem, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';


	// Your Svelte component
	import { currentUser, pb } from '$lib/pocketbase';
	import type { State } from '$lib/stores/types';
	import RationInfo from '$lib/RationInfo.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'Δεν μπόρεσε να αποθηκευτεί το σιτηρέσιο.',
		timeout: 3000,
		background: "bg-green-600"
	};
	let record:State;
	let loadedTable:boolean=false;
	let currentState:State;
	let rationName = '';
	let producerName = $currentUser?.name||"";
	let currentDate: string;
	async function saveRation() {
	let ration2save={...currentState}
	ration2save.date=currentDate
	ration2save.user=$currentUser?.id
	if (ration2save.producerName=="") ration2save.producerName=$currentUser?.name
	console.log(ration2save)
	try {
		const record= await pb.collection('rations').create(ration2save)
		te.message="Ο πίνακας σιτηρεσίου αποθηκεύτηκε επιτυχώς!"
		te.background="bg-green-600"
		toastStore.trigger(te)
	} catch (error) {
		console.log(error)
		// te.message=+"Πληροφορίες: ".concat(error)
		te.background="bg-red-600"
		toastStore.trigger(te);
	}}
// onMount(()=>{
// 	if ($page.data.ration_id){
// 		console.log($page.data.ration_id)
// 	}
// })
async function loadration(){
	
	
	try {
		record=await pb.collection('rations').getOne($page.data.ration_id)
	} catch (error) {
		console.log(error)
	}
	loadedTable=true;
	rationName=record?.rationName;
	producerName=record?.producerName;

}
$:{if ($page.data?.ration_id){  loadration().then(()=>console.log("loaded"))
	}}
	
</script>

<div class="hide-scrollbar">
	<div class="print:hidden">
		<h2 class="text-2xl md:text-4xl lg:text-5xl font-bold mb-5">Υπολογισμός Σιτηρεσίου</h2>
		<hr />
		
	</div>
	<form id="FeedRationForm" on:submit|preventDefault>
		<div class="heading print:hidden">
			<h2>Βήμα 1: Γενικές Πληροφορίες</h2>
		</div>
		
		<div class="info">
			Προεραιτικό. Συμπληρώστε μόνο αν έχετε σκοπό να αποθηκεύσετε ή να αποστείλετε το σιτηρέσιο.
		</div>
		<RationInfo bind:rationName={rationName} bind:producerName={producerName} bind:currentDate editable={true}/>
		<!-- <GeneralInfo bind:rationName={rationName} bind:producerName={producerName} bind:currentDate /> -->

		<hr />

		<div class="heading print:hidden">
			<h2>Βήμα 2: Εισαγωγή Τροφών</h2>
		</div>
		<div class="hidden print:block text-center text-lg my-3">Πίνακας Σιτηρεσίου</div>
		<div class="info" style="">
			Σημείωση: Προσθέστε τροφές πατώντας στο "Δημόσιες Τροφές".<br />
		</div>
		
	{#if !loadedTable}
			<EditableTable bind:rationName={rationName} bind:producerName={producerName} bind:currentState/>
			{:else}
			<EditableTable stage2Read={record} bind:currentState/>
	{/if}
		<!-- {JSON.stringify(currentState)} -->
		<div class="heading print:hidden">
			<h2>Βήμα 3: Αποθήκευση / Διαμοιρασμός</h2>
		</div>
		<div class="info" style="">
			Επιλέξτε μια ή και περισσότερες από τις παρακάτω επιλογές.<br />
		</div>
		<div class="text-center print:hidden">
		<Accordion>
			<AccordionItem>
				<svelte:fragment slot="lead"><div class="flex space-x-2"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
					<path d="M5 20h10a1 1 0 0 0 1-1v-5H4v5a1 1 0 0 0 1 1Z"/>
					<path d="M18 7H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h14Z"/>
				  </svg> <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 18a.969.969 0 0 0 .933 1h12.134A.97.97 0 0 0 15 18M1 7V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2v5M6 1v4a1 1 0 0 1-1 1H1m0 9v-5h1.5a1.5 1.5 0 1 1 0 3H1m12 2v-5h2m-2 3h2m-8-3v5h1.375A1.626 1.626 0 0 0 10 13.375v-1.75A1.626 1.626 0 0 0 8.375 10H7Z"/>
				  </svg></div></svelte:fragment>
				<svelte:fragment slot="summary">Εκτύπωση</svelte:fragment>
				<svelte:fragment slot="content"> <div class="card p-4">Πατώντας το συνδυασμό πλήκτρων "Control+P", περνάτε στην προεπισκόπηση εκτύπωσης του περιηγητή σας, όπου μπορείτε να εκτυπώσετε ή να αποθηκεύσετε ως pdf έγγραφο τον πίνακα σιτηρεσίου που φτιάξατε. </div>	 </svelte:fragment>
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="lead"><svg class="w-6 h-6 ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
					<path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z"/>
				  </svg></svelte:fragment>
				<svelte:fragment slot="summary">Αποθήκευση</svelte:fragment>
				<svelte:fragment slot="content">
                    <div class="card p-4">{#if !$currentUser}
Συνδέσου για να μπορείς να αποθηκεύεις σιτηρέσια στο λογαριασμό σου.
                     {:else}
                    Αποθήκευσε το παραπάνω σιτηρέσιο για μελλοντική χρήση ή επεξεργασία. <br>
                    <button class="btn my-3 variant-filled" on:click={saveRation}> Αποθήκευση</button>
                    {/if}
                    </div>
                
                    
            </svelte:fragment>
			</AccordionItem>
			<!-- <AccordionItem>
				<svelte:fragment slot="lead"><svg class="w-6 h-6 ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
					<path d="M14.419 10.581a3.564 3.564 0 0 0-2.574 1.1l-4.756-2.49a3.54 3.54 0 0 0 .072-.71 3.55 3.55 0 0 0-.043-.428L11.67 6.1a3.56 3.56 0 1 0-.831-2.265c.006.143.02.286.043.428L6.33 6.218a3.573 3.573 0 1 0-.175 4.743l4.756 2.491a3.58 3.58 0 1 0 3.508-2.871Z"/>
				  </svg></svelte:fragment>
				<svelte:fragment slot="summary">Διαμοιρασμός</svelte:fragment>
				<svelte:fragment slot="content"> </svelte:fragment>
			</AccordionItem> -->
			<AccordionItem>
				<svelte:fragment slot="lead"><svg class="w-6 h-6 ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
					<path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
				  </svg></svelte:fragment>
				<svelte:fragment slot="summary">Αποστολή E-mail</svelte:fragment>
				<svelte:fragment slot="content"> </svelte:fragment>
			</AccordionItem>
		</Accordion></div>

		
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