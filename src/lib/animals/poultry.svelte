<script>
    let poultryType = ""; // This will store the selected type for the poultry (broilers, layers)
    let stage = ""; // This will store the selected stage for the poultry

    // Use the dictionary values for POULTRY_VALUES from the Python script
    const POULTRY_VALUES = {
        // ... (the same dictionary structure as the Python script)
    };

    let requirements = {};

    function computeRequirements(poultryType, stage, weight = null) {
    let stageValues = POULTRY_VALUES[poultryType][stage];
    let requirements = {};

    // Assuming DMI (Dry Matter Intake) values are given in the form of a range (min, max)
    let minDMI = stageValues["DMI"][0];
    let maxDMI = stageValues["DMI"][1];

    // Include weight as a parameter for DMI calculation if applicable
    if (weight !== null) {
        let averageDMI = (minDMI + maxDMI) / 2;
        requirements.DMI = averageDMI + 0.01 * weight; // Example: DMI adjustment based on weight
    } else {
        requirements.DMI = (minDMI + maxDMI) / 2; // Taking the average if weight is not provided
    }

    requirements.CP = requirements.DMI * stageValues["CP"] / 100;
    requirements.ME = requirements.DMI * stageValues["ME"];
    requirements.Calcium = requirements.DMI * stageValues["Calcium"];
    requirements.Phosphorus = requirements.DMI * stageValues["Phosphorus"];
    requirements.Lysine = requirements.DMI * stageValues["Lysine"];
    requirements.Methionine = requirements.DMI * stageValues["Methionine"];
    requirements.Threonine = requirements.DMI * stageValues["Threonine"];
    requirements.VitaminA = stageValues["VitaminA"];
    requirements.VitaminD = stageValues["VitaminD"];
    requirements.VitaminE = stageValues["VitaminE"];

    return requirements;
}

</script>

<select bind:value={poultryType}>
    <option value="">-- select poultry type --</option>
    <option value="broilers">Broilers (Meat)</option>
    <option value="layers">Layers (Egg)</option>
</select>

<select bind:value={stage}>
    <option value="">-- select stage --</option>
    {#if poultryType === 'broilers'}
        <option value="starter">Starter</option>
        <option value="grower">Grower</option>
        <option value="finisher">Finisher</option>
    {:else if poultryType === 'layers'}
        <option value="starter">Starter</option>
        <option value="grower">Grower</option>
        <option value="layer">Layer</option>
    {/if}
</select>

<button on:click={computeRequirements}>Compute Nutritional Requirements</button>

<ul>
    {#if stage}
        <li><strong>DMI (g/day):</strong> {requirements.DMI.toFixed(2)}</li>
        <li><strong>CP (g/day):</strong> {requirements.CP.toFixed(2)}</li>
        <li><strong>ME (kcal/day):</strong> {requirements.ME.toFixed(2)}</li>
        <li><strong>Calcium (g/day):</strong> {requirements.Calcium.toFixed(2)}</li>
        <li><strong>Phosphorus (g/day):</strong> {requirements.Phosphorus.toFixed(2)}</li>
        <li><strong>Lysine (g/day):</strong> {requirements.Lysine.toFixed(2)}</li>
        <li><strong>Methionine (g/day):</strong> {requirements.Methionine.toFixed(2)}</li>
        <li><strong>Threonine (g/day):</strong> {requirements.Threonine.toFixed(2)}</li>
        <li><strong>Vitamin A (IU/day):</strong> {requirements.VitaminA}</li>
        <li><strong>Vitamin D (IU/day):</strong> {requirements.VitaminD}</li>
        <li><strong>Vitamin E (mg/day):</strong> {requirements.VitaminE}</li>
    {/if}
</ul>
