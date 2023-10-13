<script>
	import { page } from '$app/stores';
</script>
<p class=" my-3">Δυστυχώς, κάτι πήγε στραβά!</p>
{#if $page?.error}
        <div class="card mt-4 p-4 border-y-2">
            {#if $page?.status}
                <p>Page status: {$page?.status}</p>
            {/if}
            {#if $page?.error?.message}
                <p>Error message: {$page?.error?.message}</p>
            {/if}
        </div>
    {/if}