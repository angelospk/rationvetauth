<script lang="ts">
	import { goto } from "$app/navigation";
	import { currentUser, pb } from "$lib/pocketbase";
    import { onMount } from "svelte";
    let records:any[]=pb.collection('users').getFullList({
    sort: '-created',
})||[];
    // let columns:any[];

// onMount(async () => {
// 	records = await pb.collection('feeds').getFullList({
//     sort: '-created',
// })
//     const fir=records[0]
//     for (let i in fir){
//         console.log(i)
//     }

// })

</script>
{#if !$currentUser}
Δεν είσαι συνδεδεμένος!

{:else}
<h1>Οι Τροφές μου</h1>

{#await records}
<p>loading data</p>

{:then data} 
<div>{JSON.stringify(data)}</div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await }


<!-- <p class="btn variant-filled"></p> -->


{/if}