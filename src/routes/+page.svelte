<script>
  import { currentUser, pb } from '$lib/pocketbase';
	import { userRations } from '$lib/stores/data';
	import LoginComponent from './login/LoginComponent.svelte';

</script>


{#if $currentUser}
<h1 class="text-xl">Αρχική Σελίδα</h1>
  <p class="my-2">Καλώς ήρθες, {$currentUser.name}.<br /></p>
  <div class="flex-col w-2/3 justify-center ml-auto mr-auto flex sm:flex-row sm:space-x-5 ">
    <a href="/feeds" class="my-2 koumpi">Οι Τροφές μου</a>
    <a href="/rations" class="my-2 koumpi">Τα Σιτηρέσιά μου</a>
    <a href="/profile" class="my-2 koumpi">Το Προφίλ μου</a>
  </div>
{:else}
<div class="flex-col justify-center space-y-5 lg:space-x-5 lg:flex-row flex  pt-[3vh]">
  <div class= "text-5xl"><p class="gradient-heading">Καλώς ήλθατε!</p></div>
  <div class="max-w-md card mx-auto"><LoginComponent /></div>
</div>
{/if}
