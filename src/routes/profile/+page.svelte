<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LoadingCircles from '$lib/Loading Circles.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { userFeeds } from '$lib/stores/data';
  import { enhance } from '$app/forms';
  import type{PageData} from './$types';
	import { getToastStore } from '@skeletonlabs/skeleton';

  export let data:PageData;
  export let form:FormData;
  let formd={name:$currentUser?.name, phone:$currentUser?.phone, postalCode:$currentUser?.postalCode};
  let toast=getToastStore()
	
</script>

<div class="flex justify-center">
  <!-- create a form for the user to change his profile details, name, telephone number, address, etc -->
  <!-- here is an example of his details in a json so that it can help you: {"avatar":"","collectionId":"_pb_users_auth_","collectionName":"users","created":"2023-10-12 22:31:10.187Z","email":"test@gmail.com","emailVisibility":false,"id":"e5mmhbxzh7xru2k","name":"Kostas","updated":"2023-10-14 15:34:40.268Z","username":"users44465","verified":true} -->
  <!-- you can use the currentUser store to get the user's details -->
  
  <div class="card p-4 bg-transparent  hover:bg-gradient-to-br from-transparent to-lime-100 outline-dashed outline-blue-400">
    <h1 class="my-2 font-bold mb-4">Επεξεργασία Χρήστη</h1>
    <label for="name">Όνομα:</label>
    <input type="text" id="name" name="name" bind:value={formd.name} />
    <label for="phone">Τηλέφωνο:</label>
    <input type="tel" id="phone" name="phone" bind:value={formd.phone} />
    <!-- <label for="address">Διεύθυνση:</label>
    <input type="text" id="address" name="address" value="{$currentUser?.address||""}" />
    <label for="city">Πόλη:</label>
    <input type="text" id="city" name="city" value="{$currentUser?.city||""}" />
    <label for="country">Χώρα:</label>
    <input type="text" id="country" name="country" value="{$currentUser?.country||""}" /> -->
    <label for="postalCode">Ταχ. Κώδικας:</label>
    <input type="text" pattern="[0-9]{5}"  style="width: 4rem" id="postalCode" name="postalCode" bind:value={formd.postalCode} />
    <!-- <label for="userId">userId:</label>
    <input class="hover:cursor-not-allowed" readonly  type="text" id="userId" name="userId" value={$currentUser?.id} /> -->
<br>

    <button class="justify-center my-3 koumpi" on:click={async ()=>{
      try {
        await pb.collection('users').update($currentUser?.id, formd);
      toast.trigger({message:"Οι αλλαγές αποθηκεύτηκαν επιτυχώς!", timeout:3000, background:"bg-green-400"})
      } catch (error) {
        toast.trigger({message:"Η αποθήκευση απέτυχε!", timeout:3000, background:"bg-red-400"})
      }
      
    }} type="submit">Αποθήκευση</button>
    </div>

</div>
    
	<a type="button" href="/profile/changepass" class="btn my-6 bg-gradient-to-br variant-gradient-tertiary-primary">
		<!-- <span>(icon)</span> -->
		<p>Αλλαγή κωδικού</p>
  </a>

<style lang="postcss">
  input{
    @apply bg-transparent border-b-2 border-gray-500 outline-none focus:outline-none;
  }
  
  </style>