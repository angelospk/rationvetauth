<script lang="ts">
	import EditableTable from '$lib/EditableTable.svelte';
	import RationInfo from '$lib/RationInfo.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { getModalStore, getToastStore, type ModalSettings, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { AnimalInfo, AnimalReqs, Form, State } from '$lib/stores/types';
	import AnimalFeedRequirements from '$lib/AnimalFeedRequirements.svelte';
	import { page } from '$app/stores';
	import { metrics } from '$lib/stores/data';
	import { reverseTransformObject } from '$lib/greekfuncts';
	import { onMount } from 'svelte';
	import AccordionSaveShare from '$lib/AccordionSaveShare.svelte';
	import { fly } from 'svelte/transition';
	let animals = $page.data;
	let metr = $metrics;
	let userReqs:AnimalReqs[];
	let form: AnimalReqs = { reqs: [], fractions: {} };

	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'Δεν μπόρεσε να αποθηκευτεί το σιτηρέσιο.',
		timeout: 3000,
		background: 'bg-green-600'
	};
	const modalStore = getModalStore();
	// let selectedFeed:Feed;
	const modal: ModalSettings = {
		type: 'component',
		body: 'Επέλεξε από τη λίστα για να φορτωθεί η προδιαγραφή!',
		component: 'modalSithresia',
		response(r) {
			if (r){
			form.reqs=[...form.reqs,{Title:r.Title, type:"any", value:0}]}
		
		},
		buttonTextCancel: 'Ακύρωση',
		meta: {metrs: $metrics.filter(x=>![...form.reqs.map(y=>y.Title),"weight","Title"].includes(x.Title))}
		// backdropClasses: "!blur-1"
	};

	const modalLoadReqs: ModalSettings = {
		type: 'component',
		body: 'Επέλεξε από τη λίστα για να φορτωθεί η λίστα των προδιαγραφών!',
		component: 'modalSithresia',
		response(r) {
			if (r && r.requirements && r.requirements?.reqs.length>0){
			form=r.requirements
			// console.log(r);
			}
		
		},
		buttonTextCancel: 'Ακύρωση',
		
		// backdropClasses: "!blur-1"
	};
	const saveReqs: ModalSettings = {
	type: 'prompt',
	// Data
	title: 'Εισάγετε Όνομα',
	body: 'Ονομάστε τις προδιαγραφές για να τις ξεχωρίζετε.',
	// Populates the input value and attributes
	value: '',
	buttonTextConfirm: 'Επικύρωση',
	buttonTextCancel: 'Ακύρωση',
	valueAttr: { type: 'text', minlength: 3, required: true },
	// Returns the updated response value
	response: async (r: string) => {
		form.reqs=form.reqs.filter(x=>x.type!="any")
		let resp=await pb.collection('requirements').create({user:$currentUser?.id||"", Title:r, requirements:form})
		if (resp){
			console.log("success");
		}
	},
};
	// let metricRequirements=metrics
	let send2Email: string;
	let record: State;
	let loadedTable: boolean = false;
	let currentState: State;
	let info:AnimalInfo;
	let rationName = '';
	let producerName = $currentUser?.name || '';
	let currentDate: string;
	let addMetric:string="Διάλεξε ΘΟ"
	let mounted:Boolean;
	let test:boolean;

	onMount(async()=>
{	mounted=true;
	userReqs=await pb.collection('requirements').getFullList()||[];
	modalLoadReqs.meta={metrs:userReqs};
	if ($currentUser.Student){
		console.log("student")
		let l=await pb.collection('settings').getOne("ucz1zj2wgphtqc3")
		test=l?.test
		// .then((item)=>{test=item?.test})
	}
	// console.log(userReqs)
})
</script>


	{#if mounted}
	<div in:fly={{ y: -200, duration: 1000 }} class="print:hidden">
		<h2 class="text-xl md:text-3xl lg:text-4xl heading mb-2">
			Επίλυση Σιτηρεσίου με Γραμμικό Προγραμματισμό
		</h2>
		<div class="justify-center inline-flex mb-4">
			<a href="/newration"
				><div
					class="mx-auto rounded-full hover:underline hover:bg-gray-200 hover:bg-opacity-75 hover:ring-2 btn outline-dotted outline-1"
				>
					<p class="md:text-lg">Χειροκίνητος Υπολογισμός Σιτηρεσίου</p>
					<p class="text-xs -mb-1" />
				</div></a
			>
		</div>
		<hr />
	</div>
	{/if}
	{#if mounted}
	<div in:fly={{ y: 200, duration: 1000 }} class="overflow-x-hidden">
		
	<div class="heading print:hidden text-3xl">
		<h2>Βήμα 1: Γενικές Πληροφορίες</h2>
	</div>

	<div class="info">
		Συμπληρώστε μόνο αν έχετε σκοπό να αποθηκεύσετε ή να αποστείλετε το σιτηρέσιο.
	</div>
	<RationInfo bind:rationName bind:producerName bind:currentDate editable={true} />
	<!-- <GeneralInfo bind:rationName={rationName} bind:producerName={producerName} bind:currentDate /> -->

	<hr class="my-2" />
	
	<div class="heading print:hidden text-3xl">
		<h2>Βήμα 2: Επιλογή Ζώου και Διατροφικές Ανάγκες</h2>
	</div>
	<div class="info" style="">
		Σημείωση: Προσθέστε τροφές πατώντας στο "Δημόσιες Τροφές".<br />
	</div>
	<div class="print:hidden">
	<AnimalFeedRequirements bind:form animals={animals?.animals} bind:animalInfo={info}/>
	{#if form.reqs.length > 0 || info?.animal=="custom"}
			{#if info }
				<div class="flex-col">Ζώο: {info.animal}</div>
				{#if info.type.subselection.length>0}<div class="flex-col">{info.type.selection}/{info.type.subselection}</div>{/if}

			{/if}
			<div class="card p-3 flex space-x-3 overflow-x-auto">
				
			{#if form.reqs.length==0}
			<div  class="btn btn-sm variant-filled mx-auto text-xs h-4"><button on:click={()=>{modalStore.trigger(modalLoadReqs)}} >Άνοιγμα</button></div>
			{/if}
			
			{#each form.reqs as req}
			<div class="flex flex-col">
				{metr.find((x) => x.Title == req.Title)?.gr || req.Title}
				{metr.find((x) => x.Title == req.Title)?.units||""}
				{#if req.type != "any"}
					<input bind:value={req.value} min=0 type="number"/>
				{/if}
				<select bind:value={req.type}>
					<option value="any">Οτιδήποτε</option>
					<option value="=">{"="}</option>
					<option value=">">{">"}</option>
					<option value="<">{"<"}</option>
					<option value="-">Ανάμεσα</option>
				</select>
				{#if req.type == "-"}
					<input bind:value={req.topValue} type="number"/>
				{/if}			
			</div>
			{/each}
	
			<!-- {JSON.stringify($metrics.filter(x=>!form.reqs.map(y=>y.Title).includes(x.Title)))} -->
			<div class="ml-auto">
				<button
				class="koumpi mt-2 " id="b2"
				on:click={() => {
					modalStore.trigger(modal);
				}}>+/- ΘΟ</button
			>
			<p><button on:click={()=>{modalStore.trigger(saveReqs)}} class="koumpi mt-2">Αποθήκευση</button></p>
		</div>
		</div>
	{/if}

	<hr class="my-5" />

	<div class="heading print:hidden text-3xl">
		<h2>Βήμα 3: Εισαγωγή Τροφών</h2>
	</div>
	<div class="hidden print:block text-center text-lg my-3">Πίνακας Σιτηρεσίου</div>
	<div class="info" style="">
		Σημείωση: Προσθέστε τροφές πατώντας στο "Δημόσιες Τροφές".<br />
	</div>

	{#if !loadedTable}
		<EditableTable bind:rationName bind:producerName bind:currentState linear={true} requirementsString={reverseTransformObject(form)} requirements={form} bind:test />
	{:else}
		<EditableTable stage2Read={record} bind:currentState />
	{/if}
	


<AccordionSaveShare bind:currentDate={currentDate} bind:currentState={currentState}/>

<hr class="my-3">
<p class="text-xs print:hidden">1: Τα αποτελέσματα προκύπτουν μέσω  γραμμικού προγραμματισμού και χρησιμεύουν ως υπολογιστικές εκτιμήσεις. Ωστόσο δεν υποκαθιστούν τις συμβουλές των εμπειρογνωμόνων. Ο αλγόριθμος στοχεύει στην ελαχιστοποιήση του κόστους, όμως οι διακυμάνσεις στην ποιότητα των ζωοτροφών, οι συνθήκες υγείας των ζώων και άλλοι περιβαλλοντικοί παράγοντες μπορούν να επηρεάσουν σημαντικά την πραγματική αποτελεσματικότητα του σιτηρεσίου. Συνιστούμε ανεπιφύλακτα να συμβουλευτείτε εξειδικευμένους κτηνιάτρους και διατροφολόγους ζώων για να επικυρώσετε την καταλληλότητα και την ασφάλεια της προτεινόμενης σύνθεσης ζωοτροφών.</p>
</div></div>
{/if}

<style lang="postcss">
	.info {
		@apply my-2 bg-secondary-400 rounded-lg print:hidden mx-auto max-w-lg;
	}
	.heading {
		margin-top: 1rem;
		@apply underline;
	}

	@media print {
		/* Hide buttons and explanatory text */
		.btn {
			display: none;
		}
		.info {
			display: none;
		}
		.heading {
			display: none;
		}
		/* Adjust table layout for printing */
	}
</style>
