// import GLPK from '$lib/glpk.js';
import GLPK from '$lib/glpk.js/dist/index.js';

// export async function testSolver() {
// const glpk = GLPK();
// const options = {
//     msglev: glpk.GLP_MSG_ALL,
//     presol: true,
//     cb: {
//         call: progress => console.log(progress),
//         each: 1
//     }
// };
// const res = glpk.solve({
//     name: 'LP',
//     objective: {
//         direction: glpk.GLP_MAX,
//         name: 'obj',
//         vars: [
//             { name: 'x1', coef: 0.6 },
//             { name: 'x2', coef: 0.5 }
//         ]
//     },
//     subjectTo: [
//         {
//             name: 'cons1',
//             vars: [
//                 { name: 'x1', coef: 0.7 },
//                 { name: 'x2', coef: 2.0 }
//             ],
//             bnds: { type: glpk.GLP_DB, ub: 2.0, lb: 1.5 }
//         },
//         {
//             name: 'cons2',
//             vars: [
//                 { name: 'x1', coef: 3.0 },
//                 { name: 'x2', coef: 1.0 }
//             ],
//             bnds: { type: glpk.GLP_UP, ub: 5.0, lb: 0.0 }
//         }
//     ]
// }, options);
// console.log(res)
// return res;
// }

export default function solveLP(feeds, requirements, totalWeight = 100) {
    const glpk = GLPK();
    // GLPK.onRuntimeInitialized = () => {
    //   GLPK._setWasmPath('/path/to/glpk.wasm');
    // };
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
      bnds: {
        type: glpk.GLP_UP, // You can change this to other types as needed
        ub: req.value * totalWeight,
        lb: 0.0,
      },
    })),
  };
console.log(lp)
  const result = glpk.solve(lp, options);

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