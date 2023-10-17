<script>
    let cattleType = ""; // This will store the selected type for the cattle (beef, dairy)
    let stage = ""; // This will store the selected stage for the cattle
    let bodyWeight = 0; // This will store the body weight input by the user

    // Assuming you have a dictionary similar to previous examples named CATTLE_VALUES
    const CATTLE_VALUES = {
    beef: {
        "maintenance": {
            "DMI": [2.0, 2.5], "CP%": 8, "ME": 2.3,
            "Calcium%": 0.3, "Phosphorus%": 0.2, "Magnesium%": 0.12, "VitaminA": 1500, "VitaminD": 200, "VitaminE": 50
        },
        "growth_light": {
            "DMI": [2.5, 3.0], "CP%": 11, "ME": 2.6,
            "Calcium%": 0.5, "Phosphorus%": 0.3, "Magnesium%": 0.15, "VitaminA": 1800, "VitaminD": 250, "VitaminE": 70
        },
        "growth_rapid": {
            "DMI": [3.0, 3.5], "CP%": 13, "ME": 2.9,
            "Calcium%": 0.6, "Phosphorus%": 0.35, "Magnesium%": 0.18, "VitaminA": 2000, "VitaminD": 300, "VitaminE": 90
        },
        "finishing": {
            "DMI": [2.5, 3.0], "CP%": 12, "ME": 3.1,
            "Calcium%": 0.6, "Phosphorus%": 0.32, "Magnesium%": 0.17, "VitaminA": 1900, "VitaminD": 275, "VitaminE": 80
        }
    },
    dairy: {
        "dry": {
            "DMI": [2.0, 2.5], "CP%": 13, "ME": 2.5,
            "Calcium%": 0.6, "Phosphorus%": 0.35, "Magnesium%": 0.25, "VitaminA": 2500, "VitaminD": 400, "VitaminE": 200
        },
        "early_lactation": {
            "DMI": [3.5, 4.5], "CP%": 17, "ME": 3.0,
            "Calcium%": 0.8, "Phosphorus%": 0.4, "Magnesium%": 0.28, "VitaminA": 3000, "VitaminD": 500, "VitaminE": 500
        },
        "mid_late_lactation": {
            "DMI": [3.0, 4.0], "CP%": 15, "ME": 2.8,
            "Calcium%": 0.7, "Phosphorus%": 0.38, "Magnesium%": 0.26, "VitaminA": 2700, "VitaminD": 450, "VitaminE": 350
        },
        "peak": {
            "DMI": [4.5, 5.5], "CP%": 18, "ME": 3.3,
            "Calcium%": 0.9, "Phosphorus%": 0.42, "Magnesium%": 0.30, "VitaminA": 3200, "VitaminD": 550, "VitaminE": 600
        }
    }
};


	let requirements = {DMI:0,CP:0,ME:0,Calcium:0,Phosphorus:0,VitaminA:0,VitaminD:0,VitaminE	:0};

    function computeRequirements() {
        let stageValues = CATTLE_VALUES[cattleType][stage];

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

<button on:click={computeRequirements}>Compute Nutritional Requirements</button>

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

