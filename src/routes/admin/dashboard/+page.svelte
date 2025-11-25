<script lang="ts">
	import { SlideToggle, getToastStore } from '@skeletonlabs/skeleton';
    import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { authState, pb } from '$lib/pocketbase.svelte';
	import { goto, invalidateAll } from '$app/navigation';

    let { data } = $props();
    let selected = $state(false);

    const toastStore=getToastStore()
    onMount(async ()=>{
        if (!pb.authStore.isAdmin) {pb.admins.authRefresh(); goto('/admin')}
        let item=await pb.collection('settings').getOne("ucz1zj2wgphtqc3") as {test:boolean}
        console.log(item)
        selected=item?.test        
    })

</script>
<SlideToggle class="text-white text-xl mx-auto" name="slider-label" onchange={async()=>{
    try {
        await pb.collection('settings').update("ucz1zj2wgphtqc3", {test:selected})
    toastStore.trigger({message:`Επιτυχής ${selected?"ενεργοποίηση":"απενεργοποίηση"} διαδικασίας τεστ`, background:"bg-green-400", timeout:3000})
    } catch (error) {
        toastStore.trigger({message:`Αποτυχία ${selected?"ενεργοποίησης":"απενεργοποίησης"} διαδικασίας τεστ`, background:"bg-red-400", timeout:3000})
    }
    

}} bind:checked={selected}>Διαδικασία Εξέτασης</SlideToggle>
		<button class="koumpi max-w-md mx-auto" onclick={()=>{pb.authStore.clear();invalidateAll().then(r=>{goto('/admin')});}}>Αποσύνδεση Διαχειριστή</button>
