<script>
import { currentUser, pb } from "$lib/pocketbase";
	import Input from "postcss/lib/input";
    
let email = '';
let res;
    const handleSubmit = async () => {
        try {
            // res=await pb.collection('users').requestPasswordReset(email);
            // console.log(res);
            pb.collection('feeds').subscribe("35vfbj3kx5akeoa", (data) => {
                console.log(data);
            });
            alert('Password reset email sent!');
        } catch (error) {
            console.error(error);
            alert('Error resetting password. Please try again later.');
        }
    };
</script>

<main>
    {#if !$currentUser}
    <h1 class="text-3xl mb-6">Ξέχασες τον κωδικό σου;</h1>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="flex flex-col justify-center space-y-4 max-w-lg mx-auto">
        <p class="text-xl">
            Email: 
        </p>
        <input type="email" style="height:2.5rem;" bind:value={email} required />
        <button class="koumpi my-2 text-xl" type="submit">Επαναφορά κωδικού</button>
    </div>
    </form>
    {:else}
    <h1 class="text-xl">Είσαι συνδεδεμένος, δε χρειάζεται να επαναφέρεις τον κωδικό σου.</h1>
    <button class="koumpi my-3 w-max-wd"><a href="/">Αρχική</a></button>
    {/if}
</main>
