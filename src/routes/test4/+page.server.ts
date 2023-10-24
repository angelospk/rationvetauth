import type { Actions } from "./$types";

// const data={
//     "Αυγοπαραγωγών / Περίοδος αυγοπαραγωγής (εβδ)": {
//       "Food Intake (g/day)": "85-120",
//       "18 ως 40": {
//         "MEpoultry": 2749,
//         "CrudeProtein": 175,
//         "Lysine": 8,
//   "CrudeFiber": 70,
//   "Calcium": 35,
//   "Phosphorus": 3.5,
//   "Sodium": 1.8
//   },
//   "41 ως 60": {
//   "MEpoultry": 2749,
//   "CrudeProtein": 150,
//   "Lysine": 7,
//   "CrudeFiber": 70,
//   "Calcium": 38,
//   "Phosphorus": 3.5,
//   "Sodium": 1.8
//   },
//   "61 ως 80": {
//   "MEpoultry": 2749,
//   "CrudeProtein": 150,
//   "Lysine": 7,
//   "CrudeFiber": 70,
//   "Calcium": 40,
//   "Phosphorus": 3.5,
//   "Sodium": 1.8
//   }},
//   "Ανάπτυξη - πάχυνση ορνιθίων / Ηλικία (εβδ)": {
//   "0 ως 2": {
//   "MEpoultry": 2988,
//   "CrudeProtein": 230,
//   "Lysine": 13.5,
//   "CrudeFiber": 40,
//   "Calcium": 10,
//   "Phosphorus": 4.5,
//   "Sodium": 1.6,
//   "Food Intake (g/day)": "10-60"
//   },
//   "2 ως 5": {
//   "MEpoultry": 3107,
//   "CrudeProtein": 210,
//   "Lysine": 12,
//   "CrudeFiber": 40,
//   "Calcium": 10,
//   "Phosphorus": 4.5,
//   "Sodium": 1.6,
//   "Food Intake (g/day)": "10-60"
//   },
//   ">5":  {
//   "MEpoultry": 3107,
//   "CrudeProtein": 190,
//   "Lysine": 12,
//   "CrudeFiber": 40,
//   "Calcium": 10,
//   "Phosphorus": 6,
//   "Sodium": 1.8,
//   "Food Intake (g/day)": ">150"
//   }}}

export const actions: Actions = {
    test: async({request})=>{
    const d=Object.fromEntries(await request.formData())
    
    console.log(d)
    return {d}
}
};