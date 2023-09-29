<script>
    // Your Svelte component
import { onMount } from 'svelte';
// import { pool } from '../db'

let data = [];

onMount(async () => {
	console.log("test");
	// 	try {
	// 	const connection = await pool.getConnection();
	// 	const [rows] = await connection.query('SELECT * FROM your_table_name');
	// 	connection.release();
	// 	// data = rows;
	// 	console.log(rows);
	// } catch (error) {
	// 	console.error('Error fetching data:', error);
	// }
});

</script>

<div class="container h-full mx-auto flex justify-center items-center my-5">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Υπολογισμός Σιτηρεσίου</h2>

	</div>
</div>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
			glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
