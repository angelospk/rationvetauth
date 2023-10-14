<script lang="ts">
	import { goto } from "$app/navigation";
	import { currentUser, pb } from "$lib/pocketbase";
    import { onMount } from "svelte";
    let records:any[];
    let columns:any[];

onMount(async () => {
	records = await pb.collection('feeds').getFullList({
    sort: '-created',
})
    const fir=records[0]
    for (let i in fir){
        console.log(i)
    }

})

</script>
{#if !$currentUser}
Δεν είσαι συνδεδεμένος!

{:else}
<h1>Οι Τροφές μου</h1>

{#if records}
<div>{JSON.stringify(records)}</div>

<p class="btn variant-filled"></p>
{:else } 
<p>loading data</p>

	
{/if}

{/if}