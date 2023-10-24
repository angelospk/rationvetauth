<script>
	import { enhance } from "$app/forms";
    const data={
    "Αυγοπαραγωγών / Περίοδος αυγοπαραγωγής (εβδ)": {
      "Food Intake (g/day)": "85-120",
      "18 ως 40": {
        "MEpoultry": 2749,
        "CrudeProtein": 175,
        "Lysine": 8,
  "CrudeFiber": 70,
  "Calcium": 35,
  "Phosphorus": 3.5,
  "Sodium": 1.8
  },
  "41 ως 60": {
  "MEpoultry": 2749,
  "CrudeProtein": 150,
  "Lysine": 7,
  "CrudeFiber": 70,
  "Calcium": 38,
  "Phosphorus": 3.5,
  "Sodium": 1.8
  },
  "61 ως 80": {
  "MEpoultry": 2749,
  "CrudeProtein": 150,
  "Lysine": 7,
  "CrudeFiber": 70,
  "Calcium": 40,
  "Phosphorus": 3.5,
  "Sodium": 1.8
  }},
  "Ανάπτυξη - πάχυνση ορνιθίων / Ηλικία (εβδ)": {
  "0 ως 2": {
  "MEpoultry": 2988,
  "CrudeProtein": 230,
  "Lysine": 13.5,
  "CrudeFiber": 40,
  "Calcium": 10,
  "Phosphorus": 4.5,
  "Sodium": 1.6,
  "Food Intake (g/day)": "10-60"
  },
  "2 ως 5": {
  "MEpoultry": 3107,
  "CrudeProtein": 210,
  "Lysine": 12,
  "CrudeFiber": 40,
  "Calcium": 10,
  "Phosphorus": 4.5,
  "Sodium": 1.6,
  "Food Intake (g/day)": "10-60"
  },
  ">5":  {
  "MEpoultry": 3107,
  "CrudeProtein": 190,
  "Lysine": 12,
  "CrudeFiber": 40,
  "Calcium": 10,
  "Phosphorus": 6,
  "Sodium": 1.8,
  "Food Intake (g/day)": ">150"
  }}}
 
    let selection = '';
    let subselection = '';
    export let form;
    let formData = {}; // To hold the data to be displayed based on selections
    function handleChange() {
      formData = data[selection][subselection];
    }
  </script>
  <form use:enhance method="POST" action="?test">
    <select bind:value={selection}>
      <option value="">-- Select Category --</option>
      {#each Object.keys(data) as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  
    {#if selection}
      <select bind:value={subselection}>
        <option value="">-- Select Subcategory --</option>
        {#each Object.keys(data[selection]).filter(key => key !== 'Food Intake (g/day)') as subcategory}
          <option value={subcategory}>{subcategory}</option>
        {/each}
      </select>
    {/if}
    <button type="submit" class="btn koumpi">Υποβολή</button>
  </form>
 {JSON.stringify(form)}
  {#if formData}
    <table>
      <tr>
        <th>MEpoultry</th>
        <th>CrudeProtein</th>
        <th>Lysine</th>
        <th>CrudeFiber</th>
        <th>Calcium</th>
        <th>Phosphorus</th>
        <th>Sodium</th>
        <th>Food Intake (g/day)</th>
      </tr>
      <tr>
        <td>{formData.MEpoultry}</td>
        <td>{formData.CrudeProtein}</td>
        <td>{formData.Lysine}</td>
        <td>{formData.CrudeFiber}</td> <!-- Displaying as less than the value -->
        <td>{formData.Calcium}</td>
        <td>{formData.Phosphorus}</td>
        <td>{formData.Sodium}</td>
        <td>{formData['Food Intake (g/day)']}</td>
      </tr>
    </table>
  {/if}
  