<script lang="ts">
	import { pb } from '$lib/pocketbase.svelte';
    import type { LayoutData } from './$types';
    
    let { data, children } = $props();
    console.log(data)
</script>
<div class="flex flex-col justify-center place-center gap-3 mx-auto">
{@render children()}

</div>