<script lang="ts">
	// import { pb } from '$lib/pocketbase';
	import PocketBase from 'pocketbase';
	import Error from '../+error.svelte';
	const pb=new PocketBase("https://asf.haroldpoi.repl.co/")


let records:any[]=pb.collection('posts').getFullList({
    sort: '-created',
})

</script>

{#await records}
<p>loading data</p>

{:then data } 
<div>{JSON.stringify(data)}</div>
{:catch error}
<p>{error}</p>
{/await}
