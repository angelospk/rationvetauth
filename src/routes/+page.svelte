<script>
  import { currentUser, pb } from '$lib/pocketbase';
	import { userRations } from '$lib/stores/data';
	import LoginComponent from './login/LoginComponent.svelte';

</script>


<!-- {#if $currentUser}
<h1 class="text-xl">Αρχική Σελίδα</h1>
  <p class="my-2">Καλώς ήρθες, {$currentUser.name}.<br /></p>
  <div class="flex-col w-2/3 justify-center ml-auto mr-auto flex sm:flex-row sm:space-x-5 ">
    <a href="/feeds" class="my-2 koumpi">Οι Τροφές μου</a>
    <a href="/rations" class="my-2 koumpi">Τα Σιτηρέσιά μου</a>
    <a href="/profile" class="my-2 koumpi">Το Προφίλ μου</a>
  </div>
{:else} -->
<div class="flex-col justify-center space-y-5 lg:space-x-5 lg:flex-row flex  pt-[3vh]">
  <div class= "text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-5xl"> <div class="inline-flex "><p class="gradient-heading">Καλώς ήλθατε</p>{#if $currentUser}<p class="gradient-heading ml-3">{$currentUser.name}</p>{/if}<p class="gradient-heading">!</p></div> <br>
    <p class="my-2"> Το παρόν έργο αποτελεί καίρια καινοτομία για δημιουργία - επίλυση σιτηρεσίων για τους φοιτητές αλλά και για ιδιώτες !</p></div>
  
    {#if $currentUser}
    <div class="flex flex-col max-w-md mx-auto gap-4"><a href="/feeds" class="my-2 scale-125 koumpi">Οι Τροφές μου</a>
      <a href="/rations" class="my-2 scale-125  koumpi">Τα Σιτηρέσιά μου</a>
      <a href="/profile" class="my-2 scale-125 koumpi">Το Προφίλ μου</a></div>
      {:else}
  <div class="max-w-md card mx-auto"><LoginComponent /></div>
  {/if}
</div>
<!-- {/if} -->
