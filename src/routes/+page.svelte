<script lang="ts">
	// Your Svelte component
	import { onMount } from 'svelte';
	import { normalizeGreek } from '../greekfuncts';
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import { InputChip } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	// import { pool } from '../db'
	let rationName = '';
	let producerName = '';
	let tableInfo = false;
	let feeds=[];
	let names = {};
	// let feeds = [
	//     {
	//       feedName: '',
	//       weight: 0,
	//       dm: 0,
	//       cp: 0,
	//       tdn: 0,
	//       cf: 0,
	//       fat: 0,
	//       nem: 0,
	//       neg: 0,
	//       nel: 0,
	//       ca: 0,
	//       p: 0,
	//       source: 'BeefMag_2018',
	//     },
	//   ];
	//   const feeds = [
	//   {
	//     feedName: 'Καλαμπόκι',
	//     DryMatter: 870,
	//     CrudeProtein: 42,
	//     CrudeFiber: 22,
	//     Starch: 605,
	//     Ash: 13.5,
	//     Calcium: 0.1,
	//     Phosphorus: 2.7,
	//     Potassium: 3.3,
	//     Sodium: 0.1,
	//     GrossEnergy: 3860,
	//     MetabolizableEnergyForPoultry: 3431,
	//     MetabolizableEnergyForSwine: 2898,
	//     MEforLayingHens: 1.1,
	//     MEforBroilers: 1.11,
	//     MEforTurkeys: 1.15,
	//     MetabolizableEnergyForSwine2: 3400,
	//     MetabolizableEnergyForSwine3: 3315,
	//     MetabolizableEnergyForSwine4: 2525,
	//     MetabolizableEnergyForRabbits: 3300,
	//     MetabolizableEnergyForRabbits2: 3300,
	//     MetabolizableEnergyForPoultry2: 85,
	//     OilAndAmnioAcid: 59,
	//     ProteinAmnioAcidForPoultry: 69,
	//     ProteinAmnioAcidForSwine: 70,
	//     ProteinAmnioAcidForRabbits: 2.5,
	//     Lysine: 1.7,
	//     Methionine: 3.9,
	//     MethionineCysteine: 3.2,
	//     Threonine: 0.6,
	//     Tryptophan: 3.5,
	//     Isoleucine: 11.3,
	//     Leucine: 4.6,
	//     Valine: 4.5,
	//     Phenylalanine: 2.5,
	//     Histidine: 4.3,
	//     Arginine: 3.7,
	//     Glycine: 'cat',
	//     Category: 'corn',
	//     EnglishTitle: '',
	//     Keywords: '',
	//     weight:0.3
	//   },
	//   {
	//     feedName: 'Κριθάρι',
	//     DryMatter: 870,
	//     CrudeProtein: 18,
	//     CrudeFiber: 48,
	//     Starch: 495,
	//     Ash: 27,
	//     weight: 0,
	//     Calcium: 0.5,
	//     Phosphorus: 3.6,
	//     Potassium: 4.4,
	//     Sodium: 0.4,
	//     GrossEnergy: 3770,
	//     MetabolizableEnergyForPoultry: 3113,
	//     MetabolizableEnergyForSwine: 2597,
	//     MEforLayingHens: 0.97,
	//     MEforBroilers: 0.96,
	//     MEforTurkeys: 1,
	//     MetabolizableEnergyForSwine2: 2970,
	//     MetabolizableEnergyForSwine3: 2890,
	//     MetabolizableEnergyForSwine4: 2222,
	//     MetabolizableEnergyForRabbits: 2745,
	//     MetabolizableEnergyForRabbits2: 2745,
	//     MetabolizableEnergyForPoultry2: 95,
	//     OilAndAmnioAcid: 68,
	//     ProteinAmnioAcidForPoultry: 72,
	//     ProteinAmnioAcidForSwine: 68.5,
	//     ProteinAmnioAcidForRabbits: 3.5,
	//     Lysine: 1.6,
	//     Methionine: 4.1,
	//     MethionineCysteine: 3.1,
	//     Threonine: 1,
	//     Tryptophan: 3.5,
	//     Isoleucine: 6.4,
	//     Leucine: 5,
	//     Valine: 5.1,
	//     Phenylalanine: 2,
	//     Histidine: 4.8,
	//     Arginine: 5,
	//     Glycine: 'cat2',
	//     Category: 'soya',
	//     EnglishTitle: '',
	//     Keywords: ''
	//   },
	//   {
	//     feedName: 'Βρώμη',
	//     DryMatter: 870,
	//     weight:0,
	//     CrudeProtein: 53,
	//     CrudeFiber: 100,
	//     Starch: 370,
	//     Ash: 27,
	//     Calcium: 0.8,
	//     Phosphorus: 3.4,
	//     Potassium: 4.2,
	//     Sodium: 0.7,
	//     GrossEnergy: 4010,
	//     MetabolizableEnergyForPoultry: 2984,
	//     MetabolizableEnergyForSwine: 2485,
	//     MEforLayingHens: 0.9,
	//     MEforBroilers: 0.86,
	//     MEforTurkeys: 0.8,
	//     MetabolizableEnergyForSwine2: 230,
	//     MetabolizableEnergyForSwine3: 2650,
	//     MetabolizableEnergyForSwine4: '-',
	//     MetabolizableEnergyForRabbits: 2560,
	//     MetabolizableEnergyForRabbits2: '-',
	//     MetabolizableEnergyForPoultry2: 2560,
	//     OilAndAmnioAcid: 100,
	//     ProteinAmnioAcidForPoultry: 73,
	//     ProteinAmnioAcidForSwine: 79,
	//     ProteinAmnioAcidForRabbits: 80,
	//     Lysine: 4,
	//     Methionine: '1.6',
	//     MethionineCysteine: '5',
	//     Threonine: '3.5',
	//     Tryptophan: '1.2',
	//     Isoleucine: '4.2',
	//     Leucine: '7.3',
	//     Valine: '5.2',
	//     Phenylalanine: '5.6',
	//     Histidine: '2.2',
	//     Arginine: '6.6',
	//     Glycine: '5.5',
	//     Category: 'cat3',
	//     EnglishTitle: 'vrom',
	//     Keywords: ''
	//   }
	// ];

	let selected =[];
	let out=writable([])
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
				temp.push(names[c].gr);
			}
			return temp;
		} catch {
			return temp;
		}
	}
	$: columns = setCols(certain);
	let inputChip = '';
  	let inputChipList: string[] = [];
	let autocompleteOptions : AutocompleteOption<string>[];
	$: selected=feeds.filter(x=>inputChipList.includes(x.Title))
	function tableInfoVisibility() {
		tableInfo = !tableInfo;
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
			let temp = dat.d[1].data;
			for (const item of temp) {
				names[item.Title] = item;
			}
			// for (let c of certain){
			//   columns.push(names[c].gr)
			// }
			// console.log(columns);
			columns = setCols(certain);
			console.log(columns);

			console.log(temp);

			autocompleteOptions = feeds.map((feed) => ({
				label: feed.Title,
				value: feed.Title,
				keywords: feed.keywords.split(', ').concat(normalizeGreek(feed.Title))
			}));

			console.log(autocompleteOptions);
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
function validateFoodInput(value:string): boolean{
	// console.log(value,feeds);
	if (!autocompleteOptions.map(x=>x.label).includes(value)) return false;
	if (inputChipList.includes(value)) return false;
	if (feeds.filter(x=>x.keywords.includes(value))){
	console.log(feeds.filter(x=>x.Title==value))
	// selected.push(feeds.filter(x=>x.Title==value))
	// out.set(selected);
	console.log(selected)
	console.log($out);
	return true
	};
	
		console.log(value,feeds.filter(x=>x.Title));
	
}
</script>

<div
	class="container h-full mx-auto w-fit md:w-full flex justify-center text-center items-center my-5 overflow-y-scroll"
>
	<div class="">
		<h2 class="h2">Υπολογισμός Σιτηρεσίου</h2>
		<form id="FeedRationForm" on:submit|preventDefault={CalcAnalysis}>
			<hr />

			<div class="heading">
				<h2>Βήμα 1: Γενικές Πληροφορίες</h2>
			</div>

			<div class="info">This section is optional but recommended if outputs are emailed below.</div>

			<div class="text-lg my-4">
				<p>
					<label for="ration_name">Τίτλος Σιτηρεσίου: </label>
					<input
						id="ration_name"
						type="text"
						bind:value={rationName}
						maxlength="20"
						style="background-color: lightpink;"
					/>
				</p>

				<p>
					<label for="producer_name">Δημιουργός: </label>
					<input
						id="producer_name"
						type="text"
						bind:value={producerName}
						maxlength="20"
						style="background-color: lightpink;"
					/>
				</p>
			</div>

			<hr />

			<div class="heading">
				<h2>Βήμα 2: Εισαγωγή Τροφών</h2>
			</div>
			<div class="info" style="margin-bottom: 10px;">
				Note: Scroll table left and right if all columns are not visible.
			</div>

			<button
				class="btn-sm my-3 variant-ghost-secondary hover:scale-110"
				on:click|preventDefault={tableInfoVisibility}>Επεξήγηση Πίνακα</button
			>
			{#if tableInfo}
				<div class="text-sm max-w-50 justify-center text-center" id="footnotes">
					<div class="info" style="margin-top:10px;">
						Feedstuffs entered here will be used to generate rations in output.<br />
						<ul style="margin-left:-15px;buffer-left:0;">
							<li>Price entries should be provided on an as-fed basis.</li>
							<li>
								Select <i>[Custom]</i> and manually set nutritional info for feeds not listed.
							</li>
							<li>All nutritional info is considered to be on a dry matter basis.</li>
						</ul>
						Abbreviations:
						<ul style="margin-left:-15px;buffer-left:0;">
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
						<ul style="margin-left:-15px;buffer-left:0;">
							<li>
								BeefMag_2018: Beef Magazine. (2018, August 9). 2018 Feed Composition Tables: Use
								this to mix your cattle feed rations.
								https://www.beefmagazine.com/nutrition/2018-feed-composition-tables-use-mix-your-cattle-feed-rations
							</li>
							<li>
								OSU_2013: OSU Beef Extension. (2018, November 15). OSU_Ration_Calculator_2013.xlsx.
								http://beef.okstate.edu/files/OSU_Ration_Calculator_2013.xlsx/view
							</li>
							<li>User_Data: User-provided, laboratory feed analysis.</li>
						</ul>
					</div>
				</div>
			{/if}
			<!-- Table for feedstuff entry -->
			<div class="overflow-x-scroll">
				<table class="bg-white table-auto">
					<!-- Table headers -->
					<thead>
						<tr class="bg-gray-200 text-gray-700">
							{#each columns as column}
								<th class="text-purple-500 w-min">{column}</th>
							{/each}

							<!-- Add other table headers here -->
						</tr>
					</thead>

					<!-- Table body -->
					<tbody>
						<!-- {#each list as l}
						
						<tr class="">
							<td>{l}</td>
						</tr>
						{/each} -->
						{#each selected as feed, i}
							<tr class="">
								<td>
									<input type="text" readonly class="" value={feed.Title} />
								</td>
								<td>
									<input type="number" value={feed.weight} min="0" step="0.3" />
								</td>
								<td><input type="number" value={feed.Lysine} min="0" step="0.3" /></td>
								<td><input type="number" value={feed.Phosphorus} min="0" step="0.3" /></td>
								<td><input type="number" value={feed.CrudeFiber} min="0" step="0.3" /></td>
								<td><input type="number" value={feed.CrudeProtein} min="0" step="0.3" /></td>
								<td><input type="number" value={feed.CrudeProtein} min="0" step="0.3" /></td>
								<td><input type="number" value={feed.CrudeProtein} min="0" step="0.3" /></td>
								<td><input type="number" value={feed.CrudeProtein} min="0" step="0.3" /></td>
								<!-- Add other input fields here -->
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr class="bg-gray-200 text-gray-700">
							<th class="text-purple-500 w-min">Σύνολο</th>
							<th class="text-purple-500 w-min">{sumWeight.toFixed(2)}</th>
							<th class="text-purple-500 w-min">{sumLysine.toFixed(2)}</th>
							<th class="text-purple-500 w-min">{sumPhosphorus.toFixed(2)}</th>
							<th class="text-purple-500 w-min">{sumCrudeFiber.toFixed(2)}</th>
							<th class="text-purple-500 w-min">{sumCrudeProtein.toFixed(2)}</th>
							<th class="text-purple-500 w-min">{sumCrudeProtein.toFixed(2)}</th>
							<th class="text-purple-500 w-min">{sumCrudeProtein.toFixed(2)}</th>
							<th class="text-purple-500 w-min">{sumCrudeProtein.toFixed(2)}</th>
							<!-- Add other table footer cells here -->
						</tr>
					</tfoot>
				</table>
				<div class="secondary" style="margin-top: 5px;">
					<br />
				</div>
				<p>{$out.length}</p>
				{#each $out as feed (feed.Title)} 
				<p>{feed.DryMatter}</p>
				{/each}
				<InputChip
					bind:input={inputChip}
					bind:value={inputChipList}
					name="chips"
					validation={validateFoodInput}
					allowUpperCase
					placeholder="Εισάγετε τροφή..."
				/>
				<div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
					<Autocomplete
						bind:input={inputChip}
						options={autocompleteOptions}
						denylist={inputChipList}
						on:selection={onInputChipSelect}
					/>
				</div>

				<div class="my-3 flex justify-center">
					<button class="btn variant-filled w-1/3" on:click|preventDefault={addFeedstuffRow}
						>+ ADD FEEDSTUFF ROW</button
					>
					<button class="btn variant-filled w-1/3 mx-3" on:click|preventDefault={addFeedstuffRow}>
						Αλλαγή στηλών</button
					>
					<button class="btn variant-filled w-1/3" on:click|preventDefault={addFeedstuffRow}>
						Αλλαγή τροφών</button
					>
				</div>
			</div>

			<!-- Add Mix Sheet section here -->
			<hr />

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
	.info {
		background-color: aqua;
	}
	.heading {
		font-size: x-large;
		margin-top: 1rem;
	}
	input[type='number'] {
		width: 3rem;
	}
</style>
