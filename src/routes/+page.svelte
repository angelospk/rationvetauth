<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, blur } from 'svelte/transition';
	import { fly } from 'svelte/transition';
	import { authState, pb } from '$lib/pocketbase.svelte';
	import { appState } from '$lib/stores/data.svelte';
	import LoginComponent from './login/LoginComponent.svelte';

	let mounted = $state(false);
	let letters = $state(false);

	function typewriter(node: HTMLElement, { speed = 2 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent || '';
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t: number) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}

	onMount(async() => {
		mounted = true;
		setTimeout(()=>{letters=true;
		},600)
	});
</script>

<div class="flex-col justify-center space-y-5 lg:space-x-5 lg:flex-row flex pt-[3vh]">
	<div class="text-lg sm:text-3xl md:text-4xl lg:text-5xl max-w-5xl mr-3">
		{#if !authState.user && mounted}<p
				in:fly={{y:-150, duration:1000}}
				class="my-2 lg:mt-[30vh] lg:mr-10 text-3xl lg:text-5xl heading whitespace-pre-line"
			>Δημιουργία - επίλυση σιτηρεσίων</p>{/if}
			{#if !authState.user && letters}<p in:typewriter class="my-4 lg:mr-10 heading text-3xl lg:text-5xl  font-bold">
			για φοιτητές και ιδιώτες!
			</p>{/if}
	</div>

	{#if authState.user}
		<div class="flex flex-col mx-auto gap-4">
			<div class="inline-flex text-5xl mb-6">
				{#if mounted}<p in:fly={{ y: -200, duration: 1000 }} class="heading">
					Καλώς ήλθατε {authState.user.Student?"φοιτητή":""} {authState.user.name}!</p>{/if}
			</div>
			{#if mounted}
     <div class="max-w-sm flex flex-col mx-auto gap-3">
			<a in:fly={{ y: 100, duration: 1000 }} href="/feeds"  class="my-2 scale-125 koumpi">Οι Τροφές μου</a>
			<a in:fly={{ y: 100, duration: 1000 }} href="/rations" class="my-2 scale-125 koumpi">Τα Σιτηρέσιά μου</a>
			<a  in:fly={{ y: 100, duration: 1000 }} href="/profile" class="my-2 scale-125 koumpi">Το Προφίλ μου</a></div>{/if}
		</div>
	{:else if mounted}
		<div in:fly={{ x: 200, duration: 1500 }} class="max-w-md card mx-auto">
			<LoginComponent />
		</div>{/if}
</div>


<style lang="postcss">
	.card {
		@apply bg-gradient-to-l from-transparent to-blue-200;
	}
	@keyframes fadeInAnimation {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	heading {
		opacity: 0;
		animation: fadeInAnimation ease-in 1s;
		animation-fill-mode: forwards;
	}
</style>
