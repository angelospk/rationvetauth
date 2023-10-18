<script lang="ts">
  import TablePlaceHolder from '../../lib/TablePlaceHolder.svelte';

	import FeedsTable from '../../lib/FeedsTable.svelte';

	import { metrics, feeds, userFeeds, loadedTables } from '$lib/stores/data';
	import type { TableState } from '$lib/stores/types';




	// reactive states updating table
	const t:TableState = { selfeeds: [{ Title: 'Καλαμπόκι', weight: 3 },{id: "ntw7z3mfbc5j61x", weight: 5}], extraCols: ["Starch"] };




</script>
<h1 class="gradient-heading text-3xl">Hello. Σιτηρέσιο Εδώ.</h1>
{#if $loadedTables}
<!-- selected={selected} columns={columns} -->
<FeedsTable tableState={t}  userFeeds={$userFeeds} feeds={$feeds} metrics={$metrics} />
{:else}
<TablePlaceHolder></TablePlaceHolder>
{/if}

