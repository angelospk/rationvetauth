<script lang="ts">
   import { Autocomplete } from '@skeletonlabs/skeleton';
   import { InputChip } from '@skeletonlabs/skeleton';
  import type { AutocompleteOption } from '@skeletonlabs/skeleton';
  let inputDemo = '';
  let inputChip = '';
  let inputChipList: string[] = [];
  const flavorOptions: AutocompleteOption<string>[] = [
	{ label: 'Vanilla', value: 'Vanilla', keywords: 'plain, basic' },
	{ label: 'Chocolate', value: 'Chocolate', keywords: 'dark, white' },
	{ label: 'Strawberry', value: 'Strawberry', keywords: 'fruit' },
	{ label: 'Neapolitan', value: 'Neapolitan', keywords: 'mix, strawberry, chocolate, vanilla' },
	{ label: 'Pineapple', value: 'Pineapple', keywords: 'fruit' },
	{ label: 'Peach', value: 'Peach', keywords: 'fruit' }
];
let c=["Vanilla","Peach"]
function onFlavorSelection(event: CustomEvent<AutocompleteOption<string>>): void {
	inputDemo = event.detail.label;
}
function onInputChipSelect(event: CustomEvent<AutocompleteOption<string>>): void {
		console.log('onInputChipSelect', event.detail);
		if (inputChipList.includes(event.detail.value) === false) {
			inputChipList = [...inputChipList, event.detail.value];
			inputChip = '';
		}
	}
function validateFoodInput(value:string): boolean{
	if (!flavorOptions.map(x=>x.label).includes(value)) return false;
	if (inputChipList.includes(value)) return false;
	return true;
}
  </script>
<input class="input" type="search" name="demo" bind:value={inputDemo} placeholder="Search..." />
<div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
	<Autocomplete bind:input={inputDemo} options={flavorOptions} on:selection={onFlavorSelection} />
</div>

<InputChip bind:input={inputChip} bind:value={inputChipList} name="chips" validation={validateFoodInput} allowUpperCase />
<div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
	<Autocomplete
		bind:input={inputChip}
		options={flavorOptions}
		denylist={inputChipList}
		on:selection={onInputChipSelect}
	/>
</div>
<p>{flavorOptions.map(x=>x.label).filter(x=>inputChipList.includes(x.label))}</p>