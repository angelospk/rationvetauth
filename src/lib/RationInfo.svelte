<script lang="ts">
	export let rationName: string = '';
	export let producerName: string;
	export let currentDate = new Date().toISOString().split('T')[0];
	export let editable: boolean = false;
</script>


	{#if editable}
    <div class={"flex-grid card p-4 justify-between shadow-lg max-w-3xl mx-auto space-x-2 space-y-2 bg-success-hover-token hover:cursor-text"}>
		<input
			class="input text-center w-full print:text-center print:justify-center"
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
			class="input w-1/2 text-center"
			title="Input (text)"
			type="text"
			placeholder="Δημιουργός"
			bind:value={producerName}
		/> <div class="flex ml-2 right-0">
			<svg class="w-6 h-6 mt-2 mr-1 mx-auto text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
				<path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z"/>
			  </svg>	<input
		class="input text-center w-fit ml-2"
		title="Input (text)"
		type="date"
		readonly={true}
		placeholder="Ημερομηνία"
		value={currentDate}
	/></div></div></div>
	{:else}
    <div class={"flex-grid card p-4 justify-between shadow-lg space-x-2 space-y-2 bg-error-hover-token"}>
		<input
			class="input text-center w-full print:justify-center print:text-center"
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
			class="input w-1/2 text-center"
			title="Input (text)"
			type="text"
			readonly={true}
			placeholder="Δημιουργός"
			value={producerName}
		/> <div class="flex ml-2 right-0">
		<svg class="w-6 h-6 mt-2 mx-auto text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
			<path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z"/>
		  </svg>
    	<input
		class="input text-center w-fit ml-2"
		title="Input (text)"
		type="date"
		readonly={true}
		placeholder="Ημερομηνία"
		value={currentDate}
	/></div></div></div>
	{/if}


<br class="my-3">


