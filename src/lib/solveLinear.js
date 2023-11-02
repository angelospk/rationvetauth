// import JSLPSolver from '@ellbur/javascript-lp-solver';
// const solver = new JSLPSolver();
// // const Solver = require("javascript-lp-solver");

// export function solveLP(feeds, requirements, totalWeight=100) {
//   // Initialize the LP model
//   let model = {
//     optimize: "price", // Objective function: minimize price
//     opType: "min",
//     constraints: {},
//     variables: {},
//     // options:{"tolerance": 0.05}
//   };

//   // Add feeds as variables
//   feeds.forEach((feed, i) => {
//     // model.variables[`feed${i}`] = { price: feed.price };
//     // Object.keys(feed).forEach((key) => {
//     //   if (key !== "Title" && key !== "price" && key !== "weight") {
//     //     model.variables[`feed${i}`][key] = feed[key] * feed.weight;
//     //   }
//     // });
//     feed.weight=1;
//     model.variables[`feed${i}`]=feed;
//   });

//   // Add constraints from the requirements table
//   requirements.forEach((req) => {
//     let constraint = {};
//     // feeds.forEach((feed, i) => {
//     //   if (feed.hasOwnProperty(req.Title)) {
//     //     constraint[`feed${i}`] = feed[req.Title];
//     //   }
//     // });
//     if (feeds[0].hasOwnProperty(req.Title) && req.type!="any") {
//       model.constraints[req.Title] = {};
//       switch (req.type) {
//         case ("="):
//           model.constraints[req.Title]["equal"] = req.value*totalWeight;
//           break;
//         case (">"):
//           model.constraints[req.Title]["min"] = req.value*totalWeight;
//           break;
//         case ("<"):
//           model.constraints[req.Title]["max"] = req.value*totalWeight;
//           break;
//         case ("-"):
//           model.constraints[req.Title]["min"] = req.value*totalWeight;
//           if (req.hasOwnProperty("topValue")) {
//             model.constraints[req.Title]["max"] = req.topValue*totalWeight;
//           }
//           break;
//         default:
//           console.log("any");
//           break;

//       }
//     }
//     // model.constraints[req.Title][req.type] = req.value;

//   model.constraints["weight"]={"equal":totalWeight}
//   });
//   console.log(model);
//   // Solve the LP
//   let results = solver.Solve(model);
//   console.log(results);
//   // Display results
//   if (results.feasible) {
//     console.log("Solution is feasible. Optimal price:", results.result);
//     feeds.forEach((feed, i) => {
//       console.log(`Amount of ${feed.Title} to use: ${results[`feed${i}`]} kg`);
//     });
//   } else {
//     console.log("No feasible solution found.");
//   }

//   return results;
// }
