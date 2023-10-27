<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import { TabGroup, TabAnchor, Tab } from "@skeletonlabs/skeleton";
	import { onMount } from "svelte";
	import type { Form } from "./stores/types";
	
export let form:any;
  let selection = '';
    let subselection = '';
    let animal:string="poultry";
    let formData = {}; // To hold the data to be displayed based on selections
  export let animals;
  function reset(){
    selection=''
    subselection=''
  }
  async function handleSubmit(event:Event){
    const formEl = event.target as HTMLFormElement
    const data = new FormData(formEl)
    if (!data.has("animal")) {
    // Append 'animal' to FormData if it doesn't exist
    data.append("animal", animal); // Assuming `animal` is defined somewhere in your scope
  }

    const response = await fetch(formEl.action, {
      method: 'POST',
      body: data
    })
    const responseData = await response.json()
    // console.log(responseData);
    form=responseData
    formEl.reset()
  }

    </script>
<form on:submit|preventDefault={handleSubmit} >
<TabGroup 
	justify="justify-center"
	active="variant-filled-secondary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-fit mx-auto "
  name="animal"
>
	<Tab bind:group={animal} value="poultry" name="animal" on:click={reset}   selected={animal=="poultry"}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<span>Πουλερικά</span>
	</Tab>
    <Tab bind:group={animal} value="swine" name="animal" on:click={reset}  selected={animal=="swine"}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<span>Χοίροι</span>
	</Tab>

</TabGroup>




  <select name="selection" bind:value={selection} on:submit={()=>{
    formData={...formData, animal:animal}
  }}>
    
    <option value="">-- Επέλεξε κατηγορία --</option>
    {#each Object.keys(animals[animal]) as category}
      <option value={category}>{category}</option>
    {/each}
  </select>

  {#if selection}
    <select name="subselection" bind:value={subselection}>
      <option value="">-- Επέλεξε χρονικό διάστημα --</option>
      {#each animals[animal][selection] as subcategory}
        <option value={subcategory}>{subcategory}</option>
      {/each}
      
    </select>
    <button class="koumpi">Υποβολή</button>
  {/if}

</form>

