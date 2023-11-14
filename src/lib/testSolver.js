
import GLPK from '$lib/glpk.js/dist/index.js';
function convertType(req){
  switch(req.type){
    case ">":
      return {
        type: glpk.GLP_LO,
        lb: req.value * totalWeight,
      }
    case "<":
      return {
        type: glpk.GLP_UP,
        ub: req.value * totalWeight,
      }
    case "=":
      return {
        type: glpk.GLP_LO,
        lb: req.value * totalWeight,
      }
    case "-":
      return {
        type: glpk.GLP_DB,
        lb: req.value * totalWeight,
        ub: req.topValue * totalWeight,
      }
  }

}

export default async function solveLP(feeds, requirements, totalWeight = 100) {
    const glpk =await GLPK();

    const options = {
    msglev: glpk.GLP_MSG_ALL,
    presol: true,
    cb: {
      call: (progress) => console.log(progress),
      each: 1,
    },
  };
console.log(feeds, glpk, options)
  const lp = {
    name: 'LP',
    objective: {
      direction: glpk.GLP_MIN, // You can change this to MIN if needed
      name: 'obj',
      vars: feeds.map((feed, i) => ({
        name: `x${i}`,
        coef: feed.price, // Replace with your objective function coefficients
      })),
    },
    subjectTo: requirements.map((req) => ({
      name: req.Title,
      vars: feeds.map((feed, i) => ({
        name: `x${i}`,
        coef: feed[req.Title], // Replace with your constraint coefficients
      })),
    bnds: convertType(req)

    })),
  };
console.log(lp)
  const result = await glpk.solve(lp, options);
  // Display results
  if (result.result.status === glpk.GLP_OPT) {
    console.log('Optimal solution found. Objective value:', result.result.z);
    feeds.forEach((feed, i) => {
      console.log(`Amount of ${feed.Title} to use: ${result.result.vars[`x${i}`]}`);
    });
  } else {
    console.log('No optimal solution found.');
  }

  return result;
}