<script lang="ts">

	import { currentUser, pb } from "$lib/pocketbase";
	import type { State } from "$lib/stores/types";
	import { onMount } from "svelte";
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { goto } from "$app/navigation";
	import LoadingCircles from "$lib/Loading Circles.svelte";
	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 1000
	};
let rations:State[];
function totalWeight(selfeeds) {
		return selfeeds.reduce((acc, curr) => acc + curr.weight, 0);
	}
	onMount(async () => {
		
		try {
            rations=await pb.collection('rations').getFullList({
            				sort: '-created'
            		}) || [];
        } catch (error) {
            te.message="Απέτυχε η φόρτωση των σιτηρεσίων!"
            te.background="bg-red-600"
            toastStore.trigger(te);
            console.log(error)
        }
	});


	function gotoration(id: string|null) {
		
        console.log("/ration/"+id)
        goto("/ration/"+id)
	}
</script>
<h1 class="font-bold text-2xl mb-6">Τα Σιτηρέσιά μου</h1>

{#if !rations}
<LoadingCircles/>
{:else}
<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each rations as ration}
        <button class="card bg-white shadow-lg rounded-lg p-4 mx-auto hover:variant-outline-secondary focus:animate-ping" on:click={gotoration(ration?.id||null)}>
            <div class="flex justify-between space-x-3 sm:space-x-10 items-start">
                <h2 class="text-lg font-semibold mb-2">{ration.rationName || 'Unnamed Ration'}</h2>
                <p class="text-xs text-gray-500">{ration.updated}</p>
            </div>
            <div class="mb-2">
                <strong>Από:</strong> {ration.producerName || ''}
            </div>
            <div>
                <strong>Βάρος Μείγματος:</strong> {totalWeight(ration.tableState.selfeeds)} kg
            </div>
        </button>
    {/each}
</div>
{/if}