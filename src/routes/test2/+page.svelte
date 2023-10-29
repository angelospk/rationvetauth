<script>
    import JSLPSolver from '@ellbur/javascript-lp-solver';
    const solver = new JSLPSolver();
    const model = {
  optimize: "cost",
  opType: "min",
  constraints: {
    protein: { min: 20 },
    fiber: { max: 5 },
    energy: { min: 50 }
  },
  variables: {
    feedA: {
      cost: 2,
      protein: 8,
      fiber: 1,
      energy: 30
    },
    feedB: {
      cost: 3,
      protein: 10,
      fiber: 0,
      energy: 40
    }
  }
};

// Solve the model
const result = solver.Solve(model);

// Analyze and provide feedback
if (result.feasible) {
  console.log("A feasible solution exists.");
  console.log("Amount of feedA:", result.feedA || 0);
  console.log("Amount of feedB:", result.feedB || 0);
  console.log("Minimum cost:", result.result);
} else {
  console.log("No feasible solution exists.");
  console.log("Consider the following options to make the problem feasible:");

  // Suggestion 1: Use alternative feeds
  console.log("- Try alternative feeds that might satisfy the constraints.");

  // Suggestion 2: Relax some constraints
  console.log("- Relax some nutrient constraints to widen the feasible region.");

  // Suggestion 3: Increase available feeds
  console.log("- Increase the range of available feeds.");

};

// var results = solver.Solve(model);
// console.log(results);
</script>
{JSON.stringify(result)}
<!-- display how much attributes will be used (capacity, planes, person, cost)
{#if results!=undefined}
    {#each Object.keys(results) as key}
        {#if results[key]!=0}
            {key}: {results[key]}<br>
        {/if}
    {/each}
    <div class="flex flex-col">
    <p>{model.variables.brit.capacity*results.brit||0+model.variables.yank.capacity*results.yank||0} total capacity</p>
    <p>{model.variables.brit.plane*results.brit||0+model.variables.yank.plane*results.yank||0} total planes</p>
        <p>{model.variables.brit.person*results.brit||0+model.variables.yank.person*results.yank||0} total person</p>
            <p>{model.variables.brit.cost*results.brit||0+model.variables.yank.cost*results.yank||0} total cost</p></div>
{/if} -->


