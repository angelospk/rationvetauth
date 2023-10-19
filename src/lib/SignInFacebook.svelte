<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
    import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	export let text:string;
	const toastStore = getToastStore();
	let te: ToastSettings = {
	message: 'Δεν μπόρεσε να γίνει είσοδος μέσω Google. Δοκιμάστε άλλη μέθοδο',
	timeout: 3000,
    background: 'bg-red-600'
};
	async function loginWithFacebook() {
		// Replace this URL with the endpoint provided by Pocketbase for initiating Google OAuth.
		try{
            const authData = await pb.collection('users').authWithOAuth2({ provider: 'facebook' });
            goto('/')
        }
        catch(err){
            console.log(err);
            toastStore.trigger(te);
        }
	}
</script>


<button
	on:click|preventDefault={loginWithFacebook}
	class="facebook-button btn flex items-center justify-center text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-700 focus:ring-opacity-50 active:bg-blue-700 px-4 py-2"
>
	<img
		class="w-6 h-6 mr-2"
		src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Facebook_icon_2013.svg/1024px-Facebook_icon_2013.svg.png"
		alt="facebook logo"
	/>
	{text} Facebook
</button>
