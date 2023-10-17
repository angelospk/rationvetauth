<script lang="ts">
  import TablePlaceHolder from '../../lib/TablePlaceHolder.svelte';

	import FeedsTable from '../../lib/FeedsTable.svelte';

	import { metrics, feeds, userFeeds, type State } from '$lib/stores/data';
import { type } from 'os';




	// reactive states updating table
	const t = { selfeeds: [{ Title: 'Καλαμπόκι', weight: 3 },{id: "ntw7z3mfbc5j61x", weight: 5}], extraCols: ["Starch"] };




</script>

{#if $feeds.length > 0 && $metrics.length > 0}
<!-- selected={selected} columns={columns} -->
<FeedsTable tableState={t}  userFeeds={$userFeeds} feeds={$feeds} metrics={$metrics} edit={false} />
{:else}
<TablePlaceHolder></TablePlaceHolder>
{/if}
