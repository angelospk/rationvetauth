<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
    import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	
	const toastStore = getToastStore();
	let te: ToastSettings = {
	message: 'Δεν μπόρεσε να γίνει είσοδος μέσω Google. Δοκιμάστε άλλη μέθοδο',
	timeout: 3000,
    background: 'bg-red-600'
};
	async function loginWithGoogle() {
		// Replace this URL with the endpoint provided by Pocketbase for initiating Google OAuth.
		try{
            const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
            goto('/')
        }
        catch(err){
            console.log(err);
            toastStore.trigger(te);
        }
	}
</script>

<hr class="my-6" />
<button
	on:click|preventDefault={loginWithGoogle}
	class="google-button btn text-white transition-colors duration-200 transform bg-blue-300 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
	>Login with Google <img
		class="w-10 h-10 ml-3"
		src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
		alt="google button"
	/></button
>
