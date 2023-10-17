<script lang="ts">
    import { currentUser } from '$lib/pocketbase';
    
    export let rationName = '';
    export let producerName="";
    $:{
        if ($currentUser){
            producerName=$currentUser.name;
        }
    }
    export let currentDate = new Date().toISOString().split('T')[0];
    
</script>

<div class="heading print:hidden">
    <h2>Βήμα 1: Γενικές Πληροφορίες</h2>
</div>

<div class="info">
    This section is optional but recommended if outputs are emailed below.
</div>

<div class="text-lg my-4 flex-nowrap">
    <p class="print:flex">
        <label for="ration_name" class="print:underline">Τίτλος: </label>
        <input id="ration_name" class="print:font-bold print:ml-2" type="text" bind:value={rationName} />
    </p>

    <p class="print:flex">
        <label for="producer_name" class="print:underline">Δημιουργός: </label>
        <!-- {#if !$currentUser} -->
            <input id="producer_name" type="text" class="" bind:value={producerName} />
        <!-- {:else}
            <span class="text-center bg-primary-hover-token print:font-bold print:ml-2" id="entry_date">{$currentUser.name}</span>
        {/if} -->
    </p>
    <p class="print:flex">
        <label for="entry_date" class="print:underline">Ημερομηνία: </label>
        <span class="text-center bg-primary-hover-token print:ml-2" id="entry_date">{currentDate}</span>
    </p>
</div>

<style lang="postcss">
    .info {
        @apply my-2 bg-secondary-400 rounded-lg print:hidden;
    }
    .heading {
        font-size: x-large;
        margin-top: 1rem;
    }
   
    @media print {
        /* Hide buttons and explanatory text */
        .info {
            display: none;
        }
        /* Adjust table layout for printing */
    }
</style>
