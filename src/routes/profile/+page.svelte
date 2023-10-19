<script>

import LoadingCircles from "$lib/Loading Circles.svelte";
</script><div class="flex-container">
    <LoadingCircles/>
    <button type="button" class="btn bg-gradient-to-r border-fuchsia-300 shadow-2xl border-1 from-teal-200 to-teal-500">(icon)</button>
    <button type="button" class="btn bg-gradient-to-br variant-gradient-tertiary-primary">Button</button>
    <button type="button" class="btn bg-gradient-to-br variant-gradient-tertiary-primary">
        <span>(icon)</span>
        <span>Button</span>
    </button>
</div>