<script lang="ts">
    import { GOAT_VALUES } from '$lib/animaldata';

    let goatType = $state(""); // This will store the selected type for the goat (dairy, meat, etc.)
    let stage = $state(""); // This will store the selected stage for the goat
    let bodyWeight = $state(0); // This will store the body weight input by the user
    let milk_yield = $state(0); // Added missing variable

    let requirements = $state({
        DMI: 0,
        CP: 0,
        ME: 0,
        Calcium: 0,
        Phosphorus: 0,
        Magnesium: 0,
        VitaminA: 0,
        VitaminD: 0,
        VitaminE: 0
    });

    function computeRequirements() {
        if (!goatType || !stage || !(GOAT_VALUES as any)[goatType] || !(GOAT_VALUES as any)[goatType][stage]) return;

        let stageValues = (GOAT_VALUES as any)[goatType][stage];

        let dmi_min = stageValues["DMI"][0];
        let dmi_max = stageValues["DMI"][1];
        requirements.DMI = (bodyWeight ** 0.75) * ((dmi_min + dmi_max) / 2);

        // Check if CP% or CP exists
        let cpVal = stageValues["CP%"] || stageValues["CP"];
        requirements.CP = requirements.DMI * cpVal / 100;

        if (goatType == "dairy" && stage == "lactating") {
            // Adjust for milk yield if any (you can expand this with a milk input)
            requirements.CP += milk_yield * 0.03;
        }

        requirements.ME = requirements.DMI * stageValues["ME"];

        // Handle variations in key naming (e.g. Calcium vs Calcium%) if necessary,
        // but based on animaldata.js, GOAT_VALUES uses Calcium without %, except for dairy maybe?
        // Checking animaldata.js: GOAT_VALUES uses "Calcium", "Phosphorus" (no %).
        // But the original code multiplied by DMI * stageValues["Calcium%"].
        // If the data has values like 0.9 (which looks like percent), then we should probably treat it as percent if intended,
        // or just strict multiplication if it's absolute.
        // Looking at data: "Calcium": 0.9. If it's %, it is 0.9%. If it's grams?
        // The original code was `requirements.Calcium = requirements.DMI * stageValues["Calcium%"];`
        // But GOAT_VALUES has "Calcium" key.
        // Let's assume the key in data is "Calcium" and it acts as a percentage or factor.

        requirements.Calcium = requirements.DMI * (stageValues["Calcium"] || stageValues["Calcium%"] || 0);
        requirements.Phosphorus = requirements.DMI * (stageValues["Phosphorus"] || stageValues["Phosphorus%"] || 0);
        requirements.Magnesium = requirements.DMI * (stageValues["Magnesium"] || stageValues["Magnesium%"] || 0);

        requirements.VitaminA = stageValues["VitaminA"];
        requirements.VitaminD = stageValues["VitaminD"];
        requirements.VitaminE = stageValues["VitaminE"];
    }
</script>

<select bind:value={goatType}>
    <option value="">-- select goat type --</option>
    <option value="meat">Meat</option> <!-- Fixed value to match key in animaldata.js -->
    <option value="dairy">Dairy</option>
</select>

<select bind:value={stage}>
    <option value="">-- select stage --</option>
    <!-- keys in meat: kid, growing, mature -->
    <!-- keys in dairy: lactating, dry -->
    {#if goatType === 'meat'}
        <option value="kid">Kid</option>
        <option value="growing">Growing</option>
        <option value="mature">Mature</option>
    {:else if goatType === 'dairy'}
        <option value="lactating">Lactating</option>
        <option value="dry">Dry</option>
    {/if}
</select>

<input type="number" bind:value={bodyWeight} placeholder="Enter body weight (kg)" />

{#if goatType === 'dairy' && stage === 'lactating'}
    <input type="number" bind:value={milk_yield} placeholder="Milk yield (kg)" />
{/if}

<button onclick={computeRequirements}>Compute Nutritional Requirements</button>

<ul>
    {#if stage && bodyWeight}
        <li><strong>DMI:</strong> {requirements.DMI.toFixed(2)}</li>
        <li><strong>CP:</strong> {requirements.CP.toFixed(2)}</li>
        <li><strong>ME:</strong> {requirements.ME.toFixed(2)}</li>
        <li><strong>Calcium:</strong> {requirements.Calcium.toFixed(2)}</li>
        <li><strong>Phosphorus:</strong> {requirements.Phosphorus.toFixed(2)}</li>
        <li><strong>Magnesium:</strong> {requirements.Magnesium.toFixed(2)}</li>
        <li><strong>Vitamin A:</strong> {requirements.VitaminA}</li>
        <li><strong>Vitamin D:</strong> {requirements.VitaminD}</li>
        <li><strong>Vitamin E:</strong> {requirements.VitaminE}</li>
    {/if}
</ul>
