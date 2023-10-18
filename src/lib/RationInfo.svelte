<script lang="ts">
	export let rationName: string = '';
	export let producerName: string = '';
	export let currentDate = new Date().toISOString().split('T')[0];
	export let editable: boolean = false;
</script>


	{#if editable}
    <div class={"flex-grid card p-4 justify-between shadow-lg space-x-2 space-y-2 bg-success-hover-token hover:cursor-text"}>
		<input
			class="input w-full"
			title="Input (text)"
			type="text"
			placeholder="Τίτλος"
			bind:value={rationName}
		/>
		<div class="flex">
        <svg
			class="w-6 h-6 mt-2 mr-2 text-gray-800 dark:text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 14 18"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
			/>
		</svg>
		<input
			class="input w-1/2"
			title="Input (text)"
			type="text"
			placeholder="Δημιουργός"
			bind:value={producerName}
		/> 	<input
		class="input w-fit ml-2"
		title="Input (text)"
		type="date"
		readonly={true}
		placeholder="Ημερομηνία"
		value={currentDate}
	/></div></div>
	{:else}
    <div class={"flex-grid card p-4 justify-between shadow-lg space-x-2 space-y-2 bg-error-hover-token"}>
		<input
			class="input w-full"
			title="Input (text)"
			type="text"
			readonly={true}
			placeholder="Τίτλος"
			value={rationName}
		/>
        <div class="flex">
            <svg
			class="w-6 h-6 mt-2 mr-2 text-gray-800 dark:text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 14 18"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
			/>
		</svg>
		<input
			class="input w-1/2"
			title="Input (text)"
			type="text"
			readonly={true}
			placeholder="Δημιουργός"
			value={producerName}
		/>
    	<input
		class="input w-fit ml-2"
		title="Input (text)"
		type="date"
		readonly={true}
		placeholder="Ημερομηνία"
		value={currentDate}
	/></div></div>
	{/if}




<style>
</style>
