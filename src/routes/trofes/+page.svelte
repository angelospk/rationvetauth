<script lang="ts">
	import { currentUser, pb } from "$lib/pocketbase";
    import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
    import EditObject from "$lib/EditObject.svelte";
    import { feeds, metrics } from "$lib/stores/data";

    let records:any[]=pb.collection('feeds').getFullList({
    sort: '-created',
})||[];
let m:any=$metrics.filter(x=>x.cat)||[];

</script>
{#if !$currentUser}
Δεν είσαι συνδεδεμένος!

{:else}
{$currentUser.id}
<h1>Οι Τροφές μου</h1>

{#await records}
<p>loading data</p>

{:then data} 
<Accordion  >
	{#each data as da}
    <AccordionItem >
		<svelte:fragment slot="lead"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.109 17H1v-2a4 4 0 0 1 4-4h.87M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm7.95 2.55a2 2 0 0 1 0 2.829l-6.364 6.364-3.536.707.707-3.536 6.364-6.364a2 2 0 0 1 2.829 0Z"/>
          </svg></svelte:fragment>
		<svelte:fragment slot="summary"><div class="flex justify-between">{da.Title} <div class="">{da.updated}</div></div></svelte:fragment>
		<svelte:fragment slot="content"><EditObject objectData={da} metrics={m}/></svelte:fragment>
	</AccordionItem>
    {/each}
    
	<!-- ... -->
</Accordion>

<!-- <div>{JSON.stringify(data)}</div> -->
<Accordion><AccordionItem>
    <svelte:fragment slot="lead"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 8h6m-3 3V5m-6-.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/>
      </svg></svelte:fragment>
    <svelte:fragment slot="summary">Φτιάξε Νέα Τροφή!</svelte:fragment>
    <svelte:fragment slot="content">(content)</svelte:fragment>
</AccordionItem></Accordion>

{:catch error}
  <p style="color: red">{error.message}</p>
{/await }


<!-- <p class="btn variant-filled"></p> -->


{/if}