<script>
    import { currentUser } from "$lib/pocketbase";
</script>

<h1 class="text-xl">Αρχική Σελίδα</h1>
{#if $currentUser}
<p class="my-2">    Καλώς ήρθες, {$currentUser.name}.<br/></p>
<a href="/trofes" class="my-3 btn variant-filled">Οι Τροφές μου</a>
{/if}