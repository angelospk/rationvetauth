<script lang="ts">
	import { authState, pb } from '$lib/pocketbase.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
  let mounted = $state(false);
  let formd = $state({name: authState.user?.name, phone: authState.user?.phone, postalCode: authState.user?.postalCode});

  // Sync formd with user state if user loads later
  $effect(() => {
    if (authState.user) {
        if (!formd.name) formd.name = authState.user.name;
        if (!formd.phone) formd.phone = authState.user.phone;
        if (!formd.postalCode) formd.postalCode = authState.user.postalCode;
    }
  });

  let toast=getToastStore()
	onMount(()=>{
    mounted=true
  })
</script>
{#if mounted}
<p in:fly={{ y: -200, duration: 1000 }} class="text-3xl lg:text-5xl heading mb-6">Το προφίλ μου</p>
<div in:fly={{ y: 200, duration: 1000 }} class="flex justify-center">

  {#if !authState.user?.Student}
  <div class="card p-4 bg-transparent  hover:bg-gradient-to-br from-transparent to-lime-100 outline-dashed outline-blue-400">
    <h1 class="my-2 font-bold mb-4">Επεξεργασία Χρήστη</h1>
    <label for="name">Όνομα:</label>
    <input type="text" id="name" name="name" bind:value={formd.name} />
    <label for="phone">Τηλέφωνο:</label>
    <input type="tel" id="phone" name="phone" bind:value={formd.phone} />

    <label for="postalCode">Ταχ. Κώδικας:</label>
    <input type="text" pattern="[0-9]{5}"  style="width: 4rem" id="postalCode" name="postalCode" bind:value={formd.postalCode} />
<br>
    <button class="justify-center my-3 koumpi" onclick={async ()=>{
      try {
        await pb.collection('users').update(authState.user?.id, formd);
      toast.trigger({message:"Οι αλλαγές αποθηκεύτηκαν επιτυχώς!", timeout:3000, background:"bg-green-400"})
      } catch (error) {
        toast.trigger({message:"Η αποθήκευση απέτυχε!", timeout:3000, background:"bg-red-400"})
      }
      
    }} type="submit">Αποθήκευση</button>
    </div>
  {/if}
</div>
	<a in:fly={{ y: 200, duration: 1000 }} type="button" href="/profile/changepass" class="btn my-6 bg-gradient-to-br variant-gradient-tertiary-primary">
		<p>Αλλαγή κωδικού</p>
  </a>
  {/if}

  
<style lang="postcss">
  input{
    @apply bg-transparent border-b-2 border-gray-500 outline-none focus:outline-none;
  }
  
  </style>
