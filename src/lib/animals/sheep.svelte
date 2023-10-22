<script>
    let sheepType = ""; // This will store the selected type for the sheep (meat, wool, dairy)
    let stage = ""; // This will store the selected stage for the sheep
    let bodyWeight = 0; // This will store the body weight input by the user

    // Assuming you have a dictionary named SHEEP_VALUES similar to previous examples
	let requirements = {DMI: 0, CP: 0, ME: 0, Calcium: 0, Phosphorus: 0, VitaminA: 0, VitaminD: 0, VitaminE: 0};

    function computeRequirements() {
        let stageValues = SHEEP_VALUES[sheepType][stage];

        let dmi_min = stageValues["DMI"][0];
        let dmi_max = stageValues["DMI"][1];
        requirements.DMI = (bodyWeight ** 0.75) * ((dmi_min + dmi_max) / 2);

        requirements.CP = requirements.DMI * stageValues["CP"] / 100;
        requirements.ME = requirements.DMI * stageValues["ME"];
        requirements.Calcium = requirements.DMI * stageValues["Calcium"];
        requirements.Phosphorus = requirements.DMI * stageValues["Phosphorus"];
        requirements.VitaminA = stageValues["VitaminA"];
        requirements.VitaminD = stageValues["VitaminD"];
        requirements.VitaminE = stageValues["VitaminE"];
    }
</script>

<select bind:value={sheepType}>
    <option value="">-- select sheep type --</option>
    <option value="meat">Meat</option>
    <option value="wool">Wool</option>
    <option value="dairy">Dairy</option>
</select>

<select bind:value={stage}>
    <option value="">-- select stage --</option>
    {#if sheepType === 'meat'}
        <option value="lamb">Lamb</option>
        <option value="growing">Growing</option>
        <option value="mature">Mature</option>
    {:else if sheepType === 'wool'}
        <option value="growing">Growing</option>
        <option value="mature">Mature</option>
    {:else if sheepType === 'dairy'}
        <option value="lactating">Lactating</option>
        <option value="dry">Dry</option>
    {/if}
</select>

<input type="number" bind:value={bodyWeight} placeholder="Enter body weight (kg)" />

<button on:click={computeRequirements}>Compute Nutritional Requirements</button>

<ul>
    {#if stage && bodyWeight}
        <li><strong>DMI (kg/day):</strong> {requirements.DMI.toFixed(2)}</li>
        <li><strong>CP (kg/day):</strong> {requirements.CP.toFixed(2)}</li>
        <li><strong>ME (Mcal/day):</strong> {requirements.ME.toFixed(2)}</li>
        <li><strong>Calcium (g/day):</strong> {requirements.Calcium.toFixed(2)}</li>
        <li><strong>Phosphorus (g/day):</strong> {requirements.Phosphorus.toFixed(2)}</li>
        <li><strong>Vitamin A (IU/day):</strong> {requirements.VitaminA}</li>
        <li><strong>Vitamin D (IU/day):</strong> {requirements.VitaminD}</li>
        <li><strong>Vitamin E (mg/day):</strong> {requirements.VitaminE}</li>
    {/if}
</ul>
