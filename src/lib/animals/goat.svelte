<script>
    let goatType = ""; // This will store the selected type for the goat (dairy, meat, etc.)
    let stage = ""; // This will store the selected stage for the goat
    let bodyWeight = 0; // This will store the body weight input by the user

    // Use the dictionary values for GOAT_VALUES from the Python script
    const GOAT_VALUES = {
        // ... (the same dictionary structure as the Python script)
    };

    let requirements = {};

    function computeRequirements() {
        let stageValues = GOAT_VALUES[goatType][stage];

        let dmi_min = stageValues["DMI"][0];
        let dmi_max = stageValues["DMI"][1];
        requirements.DMI = (bodyWeight ** 0.75) * ((dmi_min + dmi_max) / 2);

        requirements.CP = requirements.DMI * stageValues["CP%"] / 100;
        if (goatType == "dairy" && stage == "lactating") {
            // Adjust for milk yield if any (you can expand this with a milk input)
            requirements.CP += milk_yield * 0.03;
        }

        requirements.ME = requirements.DMI * stageValues["ME"];
        requirements.Calcium = requirements.DMI * stageValues["Calcium%"];
        requirements.Phosphorus = requirements.DMI * stageValues["Phosphorus%"];
        requirements.Magnesium = requirements.DMI * stageValues["Magnesium%"];
        requirements.VitaminA = stageValues["VitaminA"];
        requirements.VitaminD = stageValues["VitaminD"];
        requirements.VitaminE = stageValues["VitaminE"];
    }
</script>

<select bind:value={goatType}>
    <option value="">-- select goat type --</option>
    <option value="dry">Dry</option>
    <option value="early_lactation">Early Lactation</option>
    <option value="mid_late_lactation">Mid/Late Lactation</option>
    <option value="peak">Peak</option>
</select>

<select bind:value={stage}>
    <option value="">-- select stage --</option>
    <option value="maintenance">Maintenance</option>
    <option value="growth">Growth</option>
    <option value="lactating">Lactating</option>
    <option value="dry_pregnant">Dry Pregnant</option>
</select>

<input type="number" bind:value={bodyWeight} placeholder="Enter body weight (kg)" />

<button on:click={computeRequirements}>Compute Nutritional Requirements</button>

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
