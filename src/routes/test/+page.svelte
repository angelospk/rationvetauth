<script>import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';

const pb = new PocketBase('https://ration.haroldpoi.repl.co');
let records;
onMount(async () => {
	records = await pb.collection('test').getFullList({
    sort: '-created',
})
})

</script>

<p>{JSON.stringify(records)}</p>