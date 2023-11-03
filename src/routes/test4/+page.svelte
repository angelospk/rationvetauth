<script>
  import { Graphviz } from "@hpcc-js/wasm/graphviz";
	import { onMount } from "svelte";

onMount(async () => {

  const graphviz = await Graphviz.load();

const dot = "digraph G { Hello -> World }";
const svg = graphviz.dot(dot);
})
</script>