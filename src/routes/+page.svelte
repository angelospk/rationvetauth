<script>
	import { currentUser } from '$lib/pocketbase';
</script>

<h1 class="text-xl">Αρχική Σελίδα</h1>
{#if $currentUser}
	<p class="my-2">Καλώς ήρθες, {$currentUser.name}.<br /></p>
	<div class="flex-shrink space-x-3 justify-center ">
		<a href="/trofes" class="my-3 btn variant-filled hover:variant-filled-secondary">Οι Τροφές μου</a>
		<a href="/rations" class="my-3 btn variant-filled hover:variant-filled-secondary">Τα Σιτηρέσιά μου</a>
        <a href="/profile" class="my-3 btn variant-filled hover:variant-filled-secondary">Το Προφίλ μου</a>
	</div>
{/if}
