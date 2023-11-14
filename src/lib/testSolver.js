
import GLPK from '$lib/glpk.js/dist/index.js';


export default async function solveLP(feeds, requirements, feedConstraints, totalWeight = 100) {
  const glpk =await GLPK();
  //add the index into each feed so it can be referenced later
  feeds.forEach((feed, i) => {
    feed.index = i;
  }
  );

  const convertType=(req)=>{
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
      default:
        return null;
    }
  
  } 
 

    const options = {
    msglev: glpk.GLP_MSG_ALL,
    presol: true,
    cb: {
      call: (progress) => console.log(progress),
      each: 1,
    },
  };
console.log(feeds,feedConstraints,requirements)
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
    subjectTo: requirements.filter(x=>x.type!="any").map((req) => ({
      name: req.Title,
      vars: feeds.map((feed, i) => ({
        name: `x${i}`,
        coef: feed[req.Title], // Replace with your constraint coefficients
      })),
      bnds: convertType(req, glpk)

    })).concat(feedConstraints.filter(x=>x.has).map((con) => ({
      //con has type {Title:string, has:boolean, low:number, high:number}
      // i have to find the feed with the same title as the constraint but also assign the same index to the feed as assigned above
      name: con.Title,
      vars: feeds.filter(x=>x.Title==con.Title).map((feed) => ({
        name: `x${feed.index}`,
        coef: 1, // Replace with your constraint coefficients
      })),
    
      bnds: {
        type: glpk.GLP_DB,
        lb: con.has?con.low||0:0,
        ub: con.has?con.high||100:100,
      }, 
    })
      )),
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