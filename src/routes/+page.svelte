<script>
	import { currentUser } from '$lib/pocketbase';
</script>

<h1 class="text-xl">Αρχική Σελίδα</h1>
{#if $currentUser}
	<p class="my-2">Καλώς ήρθες, {$currentUser.name}.<br /></p>
	<div class="flex-col w-2/3 ml-auto mr-auto flex sm:flex-row sm:space-x-5 ">
		<a href="/trofes" class="my-2 btn variant-filled hover:variant-filled-secondary">Οι Τροφές μου</a>
		<a href="/rations" class="my-2 btn variant-filled hover:variant-filled-secondary">Τα Σιτηρέσιά μου</a>
        <a href="/profile" class="my-2 btn variant-filled hover:variant-filled-secondary">Το Προφίλ μου</a>
	</div>
{/if}
