<script>
  import { currentUser, pb } from '$lib/pocketbase';

</script>

<h1 class="text-xl">Αρχική Σελίδα</h1>

{#if $currentUser}
  <p class="my-2">Καλώς ήρθες, {$currentUser.name}.<br /></p>
  <div class="flex-col w-2/3 justify-center ml-auto mr-auto flex sm:flex-row sm:space-x-5 ">
    <a href="/feeds" class="my-2 koumpi">Οι Τροφές μου</a>
    <a href="/rations" class="my-2 koumpi">Τα Σιτηρέσιά μου</a>
    <a href="/profile" class="my-2 koumpi">Το Προφίλ μου</a>
  </div>
{/if}

