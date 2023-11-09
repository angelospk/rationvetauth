<script lang="ts">
  import AccordionSaveShare from '../../lib/AccordionSaveShare.svelte';


	import EditableTable from '$lib/EditableTable.svelte';
	import { Accordion,  AccordionItem, getToastStore, type PopupSettings, type ToastSettings } from '@skeletonlabs/skeleton';
	// Your Svelte component
	import { currentUser, pb } from '$lib/pocketbase';
	import type { State } from '$lib/stores/types';
	import RationInfo from '$lib/RationInfo.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'Δεν μπόρεσε να αποθηκευτεί το σιτηρέσιο.',
		timeout: 3000,
		background: "bg-green-600"
	};
	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'bottom'
	};
	let send2Email:string;
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
	let mounted:Boolean;
onMount(()=>{
	mounted=true;
})
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
const print = () => {
		window.print();
	};
$:{if ($page.data?.ration_id){  loadration().then(()=>console.log("loaded"))
	}}
	
</script>

<div class="hide-scrollbar">
	{#if mounted}
	<div in:fly={{ y: -200, duration: 1000 }} class="print:hidden">
		<p class="text-xl md:text-3xl lg:text-4xl mb-2 heading">Χειροκίνητος Υπολογισμός Σιτηρεσίου</p>
		<div class="justify-center inline-flex mb-4"><a href="/newration/linear"><div class="mx-auto rounded-full hover:underline hover:bg-gray-200 hover:bg-opacity-75 hover:ring-2 btn outline-dotted outline-1 "><p class="md:text-lg">Αυτόματη Επίλυση</p> <p class="text-xs -mb-1 ">με χρήση δυναμικού προγραμματισμού</p></div></a></div>
		<hr />
		
	</div>
	{/if}
	{#if mounted}
	<form in:fly={{ y: 200, duration: 1000 }} id="FeedRationForm" on:submit|preventDefault>
		
		<div class="heading text-3xl print:hidden">
			<h2>Βήμα 1: Γενικές Πληροφορίες</h2>
		</div>
		
		<div class="info">
			Συμπληρώστε μόνο αν έχετε σκοπό να αποθηκεύσετε ή να αποστείλετε το σιτηρέσιο.
		</div>
		<RationInfo bind:rationName={rationName} bind:producerName={producerName} bind:currentDate editable={true}/>
		<!-- <GeneralInfo bind:rationName={rationName} bind:producerName={producerName} bind:currentDate /> -->

		<hr />

		<div class="heading text-3xl  print:hidden">
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
		<div class="heading text-3xl print:hidden">
			<h2>Βήμα 3: Αποθήκευση / Διαμοιρασμός</h2>
		</div>
		<div class="info" style="">
			Επιλέξτε μια ή και περισσότερες από τις παρακάτω επιλογές.<br />
		</div>
		<AccordionSaveShare bind:currentState={currentState} bind:currentDate={currentDate}></AccordionSaveShare>

		
	</form>
	{/if}
</div>
<style lang="postcss">
	.info {
		@apply my-2 bg-secondary-400 rounded-lg print:hidden mx-auto max-w-lg;
	}
	.heading {
		margin-top: 1rem;
		@apply  underline
	}

	@media print {
		/* Hide buttons and explanatory text */
		.btn {
			display: none;
		}
		.info {
			display: none;
		}
		.heading{
			display: none;
		}
		/* Adjust table layout for printing */
	}
</style>	