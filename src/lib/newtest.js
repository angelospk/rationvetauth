import("highs").then(h => {
    // console.log(highs)
    let highs=h.default()
   const sol=highs.solve(`Maximize
    obj: x + 2 y
    Subject To
    c1: x + y <= 20
    c2: x - y >= -30
    Bounds
    0 <= x
    0 <= y
    End`);
    // }
    console.log(sol);
    return (sol)
    }
).then(r=>console.log("solution "+r)).catch(err => console.log(err));

// async function test(){


// // import GLPK from 'glpk.js'
// // import highs from 'highs'
// // export default async function testSolver() {
// // var h= await highs();

// test().then(r=>console.log(r))