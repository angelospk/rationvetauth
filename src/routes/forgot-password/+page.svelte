<script>
import { currentUser, pb } from "$lib/pocketbase";
    
let email = '';
let res;
    const handleSubmit = async () => {
        try {
            await pb.collection("users").requestPasswordReset(email)
            alert('Στάλθηκε e-mail αλλαγής κωδικού!');
        } catch (error) {
            console.error(error);
            alert('Παρουσιάστηκε σφάλμα.');
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
