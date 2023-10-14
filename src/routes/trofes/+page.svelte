<script lang="ts">
	import { goto } from "$app/navigation";
	import { currentUser, pb } from "$lib/pocketbase";
    import { onMount } from "svelte";
    let records:any[];

onMount(async () => {
	records = await pb.collection('feeds').getFullList({
    sort: '-created',
})
})

</script>
{#if !$currentUser}
Δεν είσαι συνδεδεμένος!

{:else}
<h1>Οι Τροφές μου</h1>

{#if records}
<div>{JSON.stringify(records)}</div>

{:else } 
<p>loading data</p>

	
{/if}

{/if}