<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';


let records:any[];

onMount(async () => {
	records = await pb.collection('test').getFullList({
    sort: '-created',
})
})

</script>

{#if records}
<div>{JSON.stringify(records)}</div>

{:else } 
<p>loading data</p>

	
{/if}
