<script lang="ts">
    import { CATTLE_VALUES } from '$lib/animaldata';

    let cattleType = $state(""); // This will store the selected type for the cattle (beef, dairy)
    let stage = $state(""); // This will store the selected stage for the cattle
    let bodyWeight = $state(0); // This will store the body weight input by the user

    let requirements = $state({
        DMI: 0,
        CP: 0,
        ME: 0,
        Calcium: 0,
        Phosphorus: 0,
        VitaminA: 0,
        VitaminD: 0,
        VitaminE: 0
    });

    function computeRequirements() {
        if (!cattleType || !stage || !(CATTLE_VALUES as any)[cattleType] || !(CATTLE_VALUES as any)[cattleType][stage]) return;

        let stageValues = (CATTLE_VALUES as any)[cattleType][stage];

        let dmi_min = stageValues["DMI"][0];
        let dmi_max = stageValues["DMI"][1];
        requirements.DMI = (bodyWeight ** 0.75) * ((dmi_min + dmi_max) / 2);

        requirements.CP = requirements.DMI * stageValues["CP%"] / 100;
        requirements.ME = requirements.DMI * stageValues["ME"];
        requirements.Calcium = requirements.DMI * stageValues["Calcium%"];
        requirements.Phosphorus = requirements.DMI * stageValues["Phosphorus%"];
        // requirements.Potassium = requirements.DMI * stageValues["Potassium%"];
        requirements.VitaminA = stageValues["VitaminA"];
        requirements.VitaminD = stageValues["VitaminD"];
        requirements.VitaminE = stageValues["VitaminE"];
    }
</script>

<select bind:value={cattleType}>
    <option value="">-- select cattle type --</option>
    <option value="beef">Beef</option>
    <option value="dairy">Dairy</option>
</select>

<select bind:value={stage}>
    <option value="">-- select stage --</option>
    {#if cattleType === 'beef'}
        <option value="maintenance">Maintenance</option>
        <option value="growth_light">Growth (Light)</option>
        <option value="growth_rapid">Growth (Rapid)</option>
        <option value="finishing">Finishing</option>
    {:else if cattleType === 'dairy'}
        <option value="dry">Dry</option>
        <option value="early_lactation">Early Lactation</option>
        <option value="mid_late_lactation">Mid/Late Lactation</option>
        <option value="peak">Peak</option>
    {/if}
</select>

<input type="number" bind:value={bodyWeight} placeholder="Enter body weight (kg)" />

<button onclick={computeRequirements}>Compute Nutritional Requirements</button>

<ul>
    {#if stage && bodyWeight}
        <li><strong>DMI (kg/day):</strong> {requirements.DMI.toFixed(2)}</li>
        <li><strong>CP (kg/day):</strong> {requirements.CP.toFixed(2)}</li>
        <li><strong>ME (Mcal/day):</strong> {requirements.ME.toFixed(2)}</li>
        <li><strong>Calcium (g/day):</strong> {requirements.Calcium.toFixed(2)}</li>
        <li><strong>Phosphorus (g/day):</strong> {requirements.Phosphorus.toFixed(2)}</li>
        <!-- <li><strong>Potassium (g/day):</strong> {requirements.Potassium.toFixed(2)}</li> -->
        <li><strong>Vitamin A (IU/day):</strong> {requirements.VitaminA}</li>
        <li><strong>Vitamin D (IU/day):</strong> {requirements.VitaminD}</li>
        <li><strong>Vitamin E (mg/day):</strong> {requirements.VitaminE}</li>
    {/if}
</ul>
