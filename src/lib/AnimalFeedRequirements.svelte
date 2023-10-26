<script lang="ts">
	import { page } from "$app/stores";
	import { TabGroup, TabAnchor, Tab } from "@skeletonlabs/skeleton";
	import { onMount } from "svelte";
	
  let selection = '';
    let subselection = '';
    let animal:string="poultry";
    let formData = {}; // To hold the data to be displayed based on selections
    let data={};
    onMount(async()=>{
      let resp=await fetch("/api/animals")
      data=resp.json()
      console.log(data);
    })
    function handleChange() {
      formData = data[selection][subselection];
    }
    </script>

<TabGroup 
	justify="justify-center"
	active="variant-filled-secondary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-fit mx-auto "
>
	<Tab bind:group={animal} value="poultry" name="poultry"   selected={animal=="poultry"}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<span>Πουλερικά</span>
	</Tab>
    <Tab bind:group={animal} value="swine" name="swine"  selected={animal=="swine"}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<span>Χοίροι</span>
	</Tab>
	<!-- ... -->
</TabGroup>
{#await data}
loading
{:then}
forma
<!-- {JSON.stringify(d)} -->
<!-- 
<form >
  <select bind:value={selection}>
    <option value="">-- Select Category --</option>
    {#each Object.keys(data[animal]) as category}
      <option value={category}>{category}</option>
    {/each}
  </select>

  {#if selection}
    <select bind:value={subselection}>
      <option value="">-- Select Subcategory --</option>
      {#each data[animal][selection] as subcategory}
        <option value={subcategory}>{subcategory}</option>
      {/each}
    </select>
  {/if}
</form> -->

{/await}
