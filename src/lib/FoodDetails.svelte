<script lang="ts">
	import type { Feed, Column } from "./stores/types";

	export let objectData:Feed;
	export let metrics:Column[];
	export let detailed:boolean;

</script>
		{#if detailed}
			<p class="underline w-full">Βασικοί Δείκτες Χημικής Σύστασης:</p>
		{/if}
		{#each metrics.filter((x) => x.cat == 'Βασικοί Δείκτες Χημικής Σύστασης') as metric}
			<div class="form-item">
				<p>{detailed ? metric?.labelgr : metric?.gr}</p>
				<input
					class="rounded-lg"
					type="number"
					bind:value={objectData[metric.Title]}
					step="0.3"
					min="0"
				/>
			</div>
			<!-- {/if} -->
		{/each}
		<br />
		{#if detailed}
			<p class="underline w-full">Μέταλλα:</p>
		{/if}
		{#each metrics.filter((x) => x.cat == 'Μέταλλα') as metric}
			<!-- {#if key != 'user' && key != 'updated' && ke != 'created' && key != 'Title' && key != 'id' && key != 'collectionId' && key != 'collectionName'} -->
			<div class="form-item">
				<p>{detailed ? metric?.labelgr : metric?.gr}</p>
				<input
					class="rounded-lg"
					type="number"
					bind:value={objectData[metric.Title]}
					step="0.3"
					min="0"
				/>
			</div>
			<!-- {/if} -->
		{/each}
		{#if detailed}
			<p class="underline w-full">Δείκτες Ενέργειας:</p>
		{/if}
		{#each metrics.filter((x) => x.cat == 'Δείκτες Ενέργειας') as metric}
			<div class="form-item">
				<p>{detailed ? metric?.labelgr : metric?.gr}</p>
				<input
					class="rounded-lg"
					type="number"
					bind:value={objectData[metric.Title]}
					step="0.3"
					min="0"
				/>
			</div>
			<!-- {/if} -->
		{/each}
		{#if detailed}
			<p class="underline w-full">Αμινοξέα:</p>
		{/if}
		{#each metrics.filter((x) => x.cat == 'Αμινοξέα') as metric}
			<div class="form-item">
				<p>{detailed ? metric?.labelgr : metric?.gr}</p>
				<input
					class="rounded-lg"
					type="number"
					bind:value={objectData[metric.Title]}
					step="0.3"
					min="0"
				/>
			</div>
			<!-- {/if} -->
		{/each}

<style>

	.form-item {
		display: flex;
		align-items: center;
	}

	input[type='number'] {
		width: 3.5rem;
	}
</style>

