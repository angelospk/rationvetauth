<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import { TabGroup, TabAnchor, Tab } from "@skeletonlabs/skeleton";
	import { onMount } from "svelte";
	import type { AnimalInfo, Form } from "./stores/types";
	import { transformObject } from "./greekfuncts";
	import { fade, fly } from "svelte/transition";

    let { form = $bindable(), animals, animalInfo = $bindable() } = $props();

    let selection = $state('');
    let subselection = $state('');
    let animal = $state("poultry");
    let formData = $state({}); // To hold the data to be displayed based on selections

    $effect(() => {
        animalInfo = {animal: animal, type: {selection, subselection}};
    });

  function reset(){
    selection=''
    subselection=''
  }
  async function handleSubmit(event:Event){
    const formEl = event.target as HTMLFormElement
    const sentFormData = new FormData(formEl)
    // console.log(sentFormData)
    if (!sentFormData.has("animal")) {
    sentFormData.append("animal", animal);
  }
  console.log(formEl);
    const response = await fetch(formEl.action, {
      method: 'POST',
      body: sentFormData
    })
    const responseData = await response.json()
    // console.log(responseData);
    form=responseData
    form=transformObject(form)
    formEl.reset()
  }

    </script>
<form onsubmit={(e)=>{e.preventDefault(); handleSubmit(e)}} >
<TabGroup 
	justify="justify-center"
	active="variant-filled-secondary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-fit mx-auto mb-2"
  name="animal"
>
	<Tab bind:group={animal} value="poultry" name="animal" onclick={reset}   selected={animal=="poultry"}>
		{#snippet lead()}{/snippet}
		<span>Πουλερικά</span>
	</Tab>
    <Tab bind:group={animal} value="swine" name="animal" onclick={reset}  selected={animal=="swine"}>
		{#snippet lead()}{/snippet}
		<span>Χοίροι</span>
	</Tab>
  <Tab bind:group={animal} value="custom" name="animal" onclick={reset}  selected={animal=="custom"}>
		{#snippet lead()}{/snippet}
		<span>Προσαρμοσμένο</span>
	</Tab>

</TabGroup>



{#if animal!="custom"}
  <select transition:fade={{ duration:400}} name="selection" bind:value={selection} onsubmit={()=>{
    formData={...formData, animal:animal}
  }}>
    
    <option value="">-- Επέλεξε κατηγορία --</option>
    {#each Object.keys(animals[animal]) as category}
      <option value={category}>{category}</option>
    {/each}
  </select>

  {#if selection}
    <select transition:fade={{duration:300}} name="subselection" bind:value={subselection}>
      <option value="">-- Επέλεξε χρονικό διάστημα --</option>
      {#each animals[animal][selection] as subcategory}
        <option value={subcategory}>{subcategory}</option>
      {/each}
      
    </select>
    <button transition:fade={{duration:400}} class="koumpi">Υποβολή</button>
  {/if}
  {/if}
</form>
