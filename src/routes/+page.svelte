<script lang="ts">
	// Your Svelte component
	import { onMount } from 'svelte';
	import { normalizeGreek } from '../greekfuncts';
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import { InputChip } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'top'
	};
	const optionsClick: PopupSettings={
		event: 'click',
		target: 'optionsClick',
		placement: 'top'
	}
	// import { pool } from '../db'
	let rationName = '';
	let producerName = '';
	let currentDate = new Date().toISOString().split('T')[0];
	let tableInfo = false;
	let addFoodVisible = false;
	let addMetrics = false;
	let feeds = [];
	let names = {};

	let selected = [];
	let out = writable([]);
	// out.subscribe()
	let certain = [
		'Title',
		'weight',
		'DryMatter',
		'Fat',
		'CrudeFiber',
		'CrudeProtein',
		'Ash',
		'Calcium',
		'Phosphorus'
	];
	function addRow() {
		let temp = {};
		for (let c of columns) {
			temp[c] = 0;
		}
		temp['Title'] = '';
		selected.push(temp);
	}
	let metrics = [];
	let temp = {};
	for (let c of certain) {
		temp[c] = 0;
	}
	temp['Title'] = '';
	// selected.push(temp);
	let columns = [];
	function setCols(certain) {
		let temp = [];
		try {
			for (let c of certain) {
				temp.push(names[c].Title);
			}
			return temp;
		} catch {
			return temp;
		}
	}
	$: columns = setCols(certain);
	let sum = {};
	let emptySum;
	let addedMetrics = [];
	let inputChip = '';
	let inputChipList: string[] = [];
	let inputMetric = '';
	let inputmlist: string[] = [];
	$: addedMetrics = metrics.filter((x) => inputmlist.includes(x.Title));
	let autocompleteOptions: AutocompleteOption<string>[];
	let metricsAutocomplete: AutocompleteOption<string>[];
	//filtrarei ta feeds kathe fora pou allazei to inputChipList dld to koutaki pou pliktrologei o xristis
	$: selected = feeds.filter((x) => inputChipList.includes(x.Title));
	$: {
		console.log('empty:', emptySum);
		sum = { ...emptySum }; // Reset the sum object to emptySum

		if (selected.length > 0) {
			for (let i = 0; i < selected.length; i++) {
				sum.weight += selected[i].weight;
				console.log(sum.weight, selected[i].weight);

				for (let m in sum) {
					if (m !== 'weight') {
						// Use square brackets to access the property dynamically
						if (typeof (selected[i][m] == 'number')) {
							sum[m] += selected[i].weight * selected[i][m];
						}
					}
					console.log(sum);
				}
			}
		}
	}
	const tableOptions=[
		{label: "Εμφάνιση Μονάδων", visible:true},{label: "Εμφάνιση Ποσοστού", visible:true }, {label: "Εμφάνιση Ποσοστού ανά ΞΟ", visible:false}
]
	function tableInfoVisibility() {
		tableInfo = !tableInfo;
	}
	function feedAddAppear() {
		addMetrics = false;
		addFoodVisible = !addFoodVisible;
	}
	function addMetricsAppear() {
		addFoodVisible = false;
		addMetrics = !addMetrics;
	}
	function addFeedstuffRow() {
		feeds.push({
			weight: 0,
			DryMatter: 0,
			Fat: 0,
			CrudeFiber: 0,
			CrudeProtein: 0,
			Ash: 0,
			Calcium: 0,
			Phospohrus: 0,
			title: ''
		});
	}

	function showFootnotes() {
		const footnotes = document.getElementById('footnotes');
		const sbt = document.getElementById('showf');
		const hbt = document.getElementById('hidef');
		sbt.style.display = 'none';
		hbt.style.display = 'block';
		footnotes.style.display = 'block';
	}

	function hideFootnotes() {
		const footnotes = document.getElementById('footnotes');
		footnotes.style.display = 'none';
		const sbt = document.getElementById('showf');
		const hbt = document.getElementById('hidef');
		sbt.style.display = 'block';
		hbt.style.display = 'none';
	}

	// Function to calculate the sum of a specific column
	function getColumnSum(column) {
		if (column === 'weight') {
			return selected.reduce((sum, feed) => sum + parseFloat(feed[column] || 0), 0);
		} else {
			return selected.reduce(
				(sum, feed) => sum + parseFloat(feed[column] || 0) * parseFloat(feed.weight || 0),
				0
			);
		}
	}

	// Computed sums for each column
	let sumWeight = getColumnSum('weight');
	let sumLysine = getColumnSum('Lysine');
	let sumPhosphorus = getColumnSum('Phosphorus');
	let sumCrudeFiber = getColumnSum('CrudeFiber');
	let sumCrudeProtein = getColumnSum('CrudeProtein');
	let data = [];
	function CalcAnalysis() {
		console.log('calcanalysis');
	}
	function formatNumber(number) {
		return Number.isInteger(number) ? number.toString() : number.toFixed(2);
	}
	onMount(async () => {
		console.log('test');
		// addFeedstuffRow();
		let d = await fetch('/api/data');
		if (d.ok) {
			let dat = await d.json();
			// console.log(dat);
			//t=feeds
			feeds = dat.d[0].data;
			for (let i of feeds) {
				i.weight = 0;
			}
			console.log('feeds:', feeds);
			//arxikopoisi sum
			let tmp = feeds[0];
			for (let f in tmp) {
				if (typeof tmp[f] != 'string') {
					sum[f] = 0;
				}
			}
			emptySum = { ...sum };
			console.log(sum);
			let temp = dat.d[1].data;
			metrics = dat.d[1].data;
			columns = metrics.filter((x) => certain.includes(x.Title));
			for (const item of temp) {
				names[item.Title] = item;
			}
			// for (let c of certain){
			//   columns.push(names[c].gr)
			// }
			// console.log(columns);
			// columns = setCols(certain);
			// console.log(columns);

			// console.log(temp);
			console.log(metrics);
			autocompleteOptions = feeds.map((feed) => ({
				label: feed.Title,
				value: feed.Title,
				keywords: feed.keywords
					? feed.keywords.split(', ').concat(normalizeGreek(feed.Title))
					: normalizeGreek(feed.Title)
			}));
			metricsAutocomplete = metrics
				.filter((x) => !certain.includes(x.Title))
				.map((x) => ({
					label: x.labelgr,
					value: x.Title,
					keywords: normalizeGreek(x.labelgr)
				}));
			console.log(autocompleteOptions, metricsAutocomplete);
		}
	});

	function onInputChipSelect(event: CustomEvent<AutocompleteOption<string>>): void {
		console.log('onInputChipSelect', event.detail);
		if (inputChipList.includes(event.detail.value) === false) {
			inputChipList = [...inputChipList, event.detail.value];
			inputChip = '';
			// selected.push(feeds.filter(x=>x.Title==event.detail.value))
			// console.log(selected);
			// out.set(selected);
			console.log($out);
			// selected.
		}
	}
	function onInputMetricSelect(event: CustomEvent<AutocompleteOption<string>>): void {
		console.log('onInputMetricSelect', event.detail);
		if (inputmlist.includes(event.detail.value) === false) {
			inputmlist = [...inputmlist, event.detail.value];
			inputMetric = '';
			// selected.push(feeds.filter(x=>x.Title==event.detail.value))
			// console.log(selected);
			// out.set(selected);
			// console.log($out);
			// selected.
		}
	}
	function validateFoodInput(value: string): boolean {
		// console.log(value,feeds);
		if (!autocompleteOptions.map((x) => x.label).includes(value)) return false;
		if (inputChipList.includes(value)) return false;
		if (feeds.filter((x) => x.keywords.includes(value))) {
			console.log(feeds.filter((x) => x.Title == value));
			// selected.push(feeds.filter(x=>x.Title==value))
			// out.set(selected);
			console.log(selected);
			console.log($out);
			return true;
		}

		console.log(
			value,
			feeds.filter((x) => x.Title)
		);
	}
	function validateMetricInput(value: string): boolean {
		// console.log(value,feeds);
		if (!metricsAutocomplete.map((x) => x.label).includes(value)) return false;
		if (inputmlist.includes(value)) return false;
		if (metricsAutocomplete.map((x) => x.label).includes(value)) {
			// console.log(feeds.filter(x=>x.Title==value))
			// selected.push(feeds.filter(x=>x.Title==value))
			// out.set(selected);
			// console.log(selected)
			// console.log($out);
			return true;
		}

		// console.log(value,feeds.filter(x=>x.Title));
	}
</script>

<div
	class="container h-full mx-auto md:w-full flex justify-center text-center items-center my-5 overflow-y-scroll overflow-x-auto"
>
	<div class="w-full md:w-4/5 lg:w-3/4 xl:w-2/3">
		<h2 class="text-2xl md:text-4xl lg:text-5xl font-bold mb-5">Υπολογισμός Σιτηρεσίου</h2>
		<form id="FeedRationForm" on:submit|preventDefault={CalcAnalysis}>
			<hr />

			<div class="heading">
				<h2>Βήμα 1: Γενικές Πληροφορίες</h2>
			</div>

			<div class="info">This section is optional but recommended if outputs are emailed below.</div>

			<div class="text-lg my-4">
				<p>
					<label for="ration_name">Τίτλος Σιτηρεσίου: </label>
					<input id="ration_name" type="text" bind:value={rationName} />
				</p>

				<p>
					<label for="producer_name">Δημιουργός: </label>
					<input id="producer_name" type="text" bind:value={producerName} />
				</p>
				<p>
					<label for="entry_date">Ημερομηνία: </label>
					<input class="text-center  rounded-lg shadow-lg bg-primary-hover-token" id="entry_date" type="text" bind:value={currentDate} readonly />
				  </p>
			</div>

			<hr />

			<div class="heading">
				<h2>Βήμα 2: Εισαγωγή Τροφών</h2>
			</div>
			<div class="info" style="">
				Σημείωση: Προσθέστε τροφές πατώντας στο "Αλλαγή Τροφών.<br>
			</div>

			<!-- Table for feedstuff entry -->
			{#if feeds.length > 0}
				<!-- <button
					class="btn-sm my-3 variant-ghost-secondary hover:scale-110" use:popup={popupClick}
					on:click|preventDefault={tableInfoVisibility}>Επεξήγηση Πίνακα</button
				> -->
				<div class="flex space-x-5 justify-center">
				<button class="btn-sm my-3 variant-ghost-secondary hover:scale-110"  use:popup={popupClick}
					>Επεξήγηση Πίνακα</button
				>
				<button class="btn-sm my-3 variant-ghost-secondary hover:scale-110"  use:popup={optionsClick}
					>Επιλογές Πίνακα</button
				> </div>
				<div class="card p-4 variant-filled-secondary" data-popup="optionsClick">
					<ol>
					{#each tableOptions as option }
					<li><SlideToggle name="slider-large" active="bg-primary-500" size="sm" bind:checked={option.visible}> {option.label}</SlideToggle></li>
					{/each}
				</ol>
				<div class="arrow variant-filled-secondary" />
				</div>
				<div class="card p-4 variant-filled-primary" data-popup="popupClick">
					<p class="underline">Διατροφικά στοιχεία πίνακα:</p>
					<ul>
						<li>ΞΟ = Ξηρά Ουσία</li>
						<li>ΟΛΟ = Ολικές Λιπαρές Ουσίες</li>
						<li>ΟΚ = Ολικές Κυταρρίνες</li>
						<li>Ca = Ασβέστιο</li>
						<!-- <li>NE<sub>m</sub> = Net Energy for Maintenance</li> -->
						<!-- <li>NE<sub>g</sub> = Net Energy for Gain</li> -->
						<!-- <li>NE<sub>l</sub> = Net Energy for Lactation</li> -->
						<li>P = Φωσφόρος</li>
						<li>ΟΑΟ = Ολικές Αζωτούχες Ουσίες</li>
					</ul>
					<p class="text-xs my-2">Στη γραμμή "Σύνολο" οι μονάδες εκτός τη στήλης "Βάρος" είναι g ή kcal αντίστοιχα.</p>
					<!-- <u>Feedstuff nutritional data sources:</u>
							<ul>
								<li>
									BeefMag_2018: Beef Magazine. (2018, August 9). 2018 Feed Composition Tables: Use
									this to mix your cattle feed rations.
									https://www.beefmagazine.com/nutrition/2018-feed-composition-tables-use-mix-your-cattle-feed-rations
								</li>
								<li>
									OSU_2013: OSU Beef Extension. (2018, November 15).
									OSU_Ration_Calculator_2013.xlsx.
									http://beef.okstate.edu/files/OSU_Ration_Calculator_2013.xlsx/view
								</li>
								<li>User_Data: User-provided, laboratory feed analysis.</li>
							</ul> -->
					<div class="arrow variant-filled-primary" />
				</div>
				<div class="text-sm max-w-lg flex" id="footnotes">
					{#if tableInfo}
						<div class="info justify-center content-center text-center border-red-500">
							Feedstuffs entered here will be used to generate rations in output.<br />
							<ul>
								<li>Price entries should be provided on an as-fed basis.</li>
								<li>
									Select <i>[Custom]</i> and manually set nutritional info for feeds not listed.
								</li>
								<li>All nutritional info is considered to be on a dry matter basis.</li>
							</ul>
							Abbreviations:
							<ul>
								<li>DM = Dry Matter</li>
								<li>CP = Crude Protein</li>
								<li>TDN = Total Digestible Nutrients</li>
								<li>CF = Crude Fiber</li>
								<li>NE<sub>m</sub> = Net Energy for Maintenance</li>
								<li>NE<sub>g</sub> = Net Energy for Gain</li>
								<li>NE<sub>l</sub> = Net Energy for Lactation</li>
								<li>Ca = Calcium</li>
								<li>P = Phosphorus</li>
							</ul>
							<u>Feedstuff nutritional data sources:</u>
							<ul>
								<li>
									BeefMag_2018: Beef Magazine. (2018, August 9). 2018 Feed Composition Tables: Use
									this to mix your cattle feed rations.
									https://www.beefmagazine.com/nutrition/2018-feed-composition-tables-use-mix-your-cattle-feed-rations
								</li>
								<li>
									OSU_2013: OSU Beef Extension. (2018, November 15).
									OSU_Ration_Calculator_2013.xlsx.
									http://beef.okstate.edu/files/OSU_Ration_Calculator_2013.xlsx/view
								</li>
								<li>User_Data: User-provided, laboratory feed analysis.</li>
							</ul>
						</div>
					{/if}
				</div>
				<div class="relative overflow-x-auto">
					<table class="bg-white w-full">
						<!-- Table headers -->
						<thead>
							<tr class="bg-stone-400 text-gray-700">
								{#each columns as column}
									<th class="text-primary  w-min">{column.gr}</th>
								{/each}
								{#each addedMetrics as column}
									<th class="text-primary bg w-min">{column.gr}</th>
								{/each}
								<!-- Add other table headers here -->
							</tr>
							{#if tableOptions[0].visible}
								<tr class="text-gray-700 bg-green-100 text-sm">
									{#each columns as column}
										{#if column.Title == 'Title'}
											<th class="text-black-700 w-min">Μονάδες</th>
										{:else if column.units !== undefined}
											<td>{column.units}</td>
										{:else}
											<td />
										{/if}
									{/each}
									{#each addedMetrics as column}
										{#if column.Title == 'Title'}
											<th class="text-purple-500 w-min">Μονάδες</th>
										{:else if column.units !== undefined}
											<td class="text-lg">{column.units}</td>
										{:else}
											<td />
										{/if}
									{/each}</tr
								>
							{/if}
						</thead>

						<!-- Table body -->
						<tbody>
							{#each selected as feed, i}
								<tr class="">
									<th>
										<!-- <input type="text" readonly class="text-center" value={feed.Title} /> -->
										<span class="w-min text-gray-500 text-sm">{feed.Title}</span>
									</th>
									{#each columns as column}
										{#if column.Title != 'Title'}
											<!-- <p>{column}</p> -->
											<td
												><input
													type="number"
													bind:value={feed[column.Title]}
													min="0"
													step="0.3"
												/></td
											>
										{/if}
									{/each}
									{#each addedMetrics as column}
										<td
											><input
												type="number"
												bind:value={feed[column.Title]}
												min="0"
												step="0.3"
											/></td
										>
									{/each}
								</tr>
							{/each}
						</tbody>
						<tfoot>
							<tr class="bg-gray-300 text-gray-700 text-lg">
								<th class="text-purple-500 w-min">Σύνολο</th>
								{#each columns as column}
									{#if column.Title != 'Title'}
										<td class="font-bold text-left pl-2">{formatNumber(sum[column.Title])}</td>
									{/if}
								{/each}
								{#each addedMetrics as column}
									<td class="font-bold text-left pl-2">{formatNumber(sum[column.Title])}</td>
								{/each}
							</tr>

							{#if tableOptions[1].visible}
								<tr class="bg-gray-200 text-gray-700">
									<th class="text-purple-500 w-min text-sm">Ποσοστό</th>
									<td />
									{#each columns as column}
										{#if column.Title != 'Title' && column.Title != 'weight'}
											<td class="font-bold">{formatNumber(sum[column.Title] / sum['weight'] / 10)}</td
											>
										{/if}
									{/each}
									{#each addedMetrics as column}
										<td class="font-bold">{formatNumber(sum[column.Title] / sum['weight'] / 10)}</td>
									{/each}
								</tr>
							{/if}
							{#if tableOptions[2].visible}
								<tr class="bg-gray-200 text-gray-700">
									<th class="text-purple-500 w-min text-sm">Ποσοστό / ΞΟ </th>
									<td />
									{#each columns as column}
										{#if column.Title != 'Title' && column.Title != 'weight'}
											<td class="font-bold"
												>{formatNumber((100 * sum[column.Title]) / sum.DryMatter)}</td
											>
										{/if}
									{/each}
									{#each addedMetrics as column}
										<td class="font-bold"
											>{formatNumber((100 * sum[column.Title]) / sum.DryMatter)}</td
										>
									{/each}
								</tr>
							{/if}
						</tfoot>
					</table>
				</div>
				<div class="secondary" style="margin-top: 5px;">
					<br />
				</div>

				<div class="my-3 flex justify-between">
					<button class="btn variant-filled w-1/3" on:click|preventDefault={feedAddAppear}
						>Αλλαγή Τροφών</button
					>
					<button class="btn variant-filled w-1/3 ml-6" on:click|preventDefault={addMetricsAppear}>
						Αλλαγή στηλών</button
					>
				</div>
				<div class="my-3 flex justify-end">
					{#if addMetrics}
						<div class="card max-w-md max-h-60 p-4 overflow-y-auto" tabindex="-1">
							<InputChip
								bind:input={inputMetric}
								bind:value={inputmlist}
								name="chips"
								validation={validateMetricInput}
								allowUpperCase
								placeholder="Εισάγετε στήλη..."
							/>
							<Autocomplete
								bind:input={inputMetric}
								options={metricsAutocomplete}
								denylist={inputmlist}
								on:selection={onInputMetricSelect}
							/>
						</div>
					{/if}
				</div>
				<div class="my-3 max-w-lg flex justify-start">
					{#if addFoodVisible}
						<div class="card max-w-md max-h-60 p-4 overflow-y-auto" tabindex="-1">
							<InputChip
								bind:input={inputChip}
								bind:value={inputChipList}
								name="στήλη"
								validation={validateFoodInput}
								allowUpperCase
								placeholder="Εισάγετε τροφή..."
							/>
							<Autocomplete
								bind:input={inputChip}
								options={autocompleteOptions}
								denylist={inputChipList}
								on:selection={onInputChipSelect}
							/>
						</div>
					{/if}
				</div>
			{:else}
				<p>
					Οι διαθέσιμες τροφές φορτώνονται...<br />Σε περίπτωση καθυστέρησης, ξαναφορτώστε τη
					σελίδα.
				</p>
				<section class="card w-full">
					<div class="p-4 space-y-4">
						<div class="placeholder" />
						<div class="grid grid-cols-3 gap-8">
							<div class="placeholder" />
							<div class="placeholder" />
							<div class="placeholder" />
						</div>
						<div class="grid grid-cols-4 gap-4">
							<div class="placeholder" />
							<div class="placeholder" />
							<div class="placeholder" />
							<div class="placeholder" />
						</div>
					</div>
				</section>
			{/if}
			<!-- Add Mix Sheet section here -->
			<hr class="my-3" />

			<div class="heading">
				<h2>Step 3: Mix Sheet</h2>
			</div>

			<div class="default">
				<p>
					<label for="batch_lb">Set Batch Wt, lb: </label><br />
					<input id="batch_lb" type="number" step="1" on:input={CalcAnalysis} />
				</p>
			</div>

			<div style="overflow-x: auto;">
				<!-- Add Mix Sheet table here -->
			</div>
		</form>
	</div>
</div>

<style lang="postcss">
	.info{
		@apply my-2 bg-secondary-400 rounded-lg
	}
	.heading {
		font-size: x-large;
		margin-top: 1rem;
	}
	input[type='number'] {
		width: 3.5rem;
	}
	th,
	td {
		border: 1px dotted black;
	}
</style>
