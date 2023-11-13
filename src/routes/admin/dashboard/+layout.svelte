<script lang="ts">
	import { pb } from '$lib/pocketbase';
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
    console.log(data)
</script>
<div class="flex flex-col justify-center place-center gap-3 mx-auto">
<slot/>

</div>