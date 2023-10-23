<script>
    import { enhance } from 'svelte-forms-lib'; // You need to have svelte-forms-lib installed
  
    let selection = '';
    let subselection = '';
  
    let data = {
      "Αυγοπαραγωγών / Περίοδος αυγοπαραγωγής (εβδ)": {
        // ... same structure as you provided
      },
      "Ανάπτυξη - πάχυνση ορνιθίων / Ηλικία (εβδ)": {
        // ... same structure as you provided
      }
    }
  
    let formData = {}; // To hold the data to be displayed based on selections
  
    function handleChange() {
      formData = data[selection][subselection];
    }
  </script>
  
  <form use:enhance on:change={handleChange}>
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
  </form>
  
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
        <td>< {formData.CrudeFiber}</td> <!-- Displaying as less than the value -->
        <td>{formData.Calcium}</td>
        <td>{formData.Phosphorus}</td>
        <td>{formData.Sodium}</td>
        <td>{formData['Food Intake (g/day)']}</td>
      </tr>
    </table>
  {/if}
  