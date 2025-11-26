<script lang="ts">
	import { enhance } from '$app/forms';

	import { goto } from '$app/navigation';

	import LoadingCircles from '$lib/Loading Circles.svelte';
	import { pb, authState } from '$lib/pocketbase.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	let te: ToastSettings = {
		message: 'This message will auto-hide after 3 seconds.',
		timeout: 3000
	};
	let loading = $state(false);
	//add missing variables
	let password = $state("");
	let passwordConfirm = $state("");
	let text = $state("");
	let oldPassword = $state("");
    async function passchange(){
        loading=true;
        const data={oldPassword:oldPassword, password:password, passwordConfirm:passwordConfirm}
        try{
        await pb.collection('users').update(authState.user?.id, data)
            te.message="Επιτυχής αλλαγή κωδικού!"
            te.background="bg-green-600"
            toastStore.trigger(te)

    }
        catch(err){
            console.log(err)
            te.message="Ο κωδικός δεν άλλαξε!"
            te.background="bg-red-600"
            toastStore.trigger(te)
        }
loading=false;

    }
</script>

<div class="mt-8 max-w-lg mx-auto">
	
		<div class="mt-6 ">
			<div class="text-center mb-2">
				<h1 class="text-xl underline">Αλλαγή κωδικού</h1>
			</div>
			<center>Παλιός</center>
            <input
				type="password"
				bind:value={oldPassword}
				name="oldpassword"
				id="oldpassword"
				placeholder="Παλιός Κωδικός"
				required={true}
				class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
			/>
            <hr class="my-3"/>
            <center>Νέος</center>
			<input
				type="password"
				bind:value={password}
				name="password"
				id="password"
				placeholder="Νέος Κωδικός"
				required={true}
				class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
			/>
			<input
				type="password"
				bind:value={passwordConfirm}
				name="passwordConfirm"
				id="passwordConfirm"
				placeholder="Επαλήθευση Νέου Κωδικού"
				required={true}
				class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
			/>
		</div>

		<div class="mt-6">
			{#if !loading}
				<button
					class="w-full px-4 py-2 koumpi" onclick={passchange}
				>
					Αλλαγή κωδικού
				</button>
			{:else}
				<LoadingCircles />
			{/if}
		</div>

</div>
