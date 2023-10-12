<script lang="ts">
	import '../app.postcss';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
			
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">ΣΙΤ</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="/test"
					rel="noreferrer"
				>
					test
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="/sit"
					rel="noreferrer"
				>
					Επίλυση
				</a>
				<a
					class="btn btn-sm variant-ghost-surface hover:underline hover:variant-filled-primary"
					href="/login"
					rel="noreferrer"
				>
					Σύνδεση
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<div
		class="container h-full mx-auto md:w-full flex justify-center text-center items-center my-5 overflow-y-scroll overflow-x-auto"
	>
	<div class="w-full md:w-4/5 lg:w-3/4 xl:w-2/3">
	<slot > </slot>
</div></div>
</AppShell>
