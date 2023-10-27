import type { Actions, PageServerLoad } from "./$types";
import {animals} from "$lib/animaldata"
import { json } from "@sveltejs/kit";


export const load: PageServerLoad = async () => {
    const simplifiedAnimals = {};
    for (const [animalType, animalData] of Object.entries(animals)) {
        simplifiedAnimals[animalType] = {};
        
        for (const [category, categoryData] of Object.entries(animalData)) {
          simplifiedAnimals[animalType][category] = Object.keys(categoryData);
        }
      }

    return {animals:simplifiedAnimals}
};

// export const actions: Actions = {
//   default: async ({request}) => {
//     const data=Object.fromEntries(await request.formData())
//     console.log(data)
//     try{
//       const {animal, selection, subselection}=data;
//       const b=animals[animal][selection][subselection]
//       console.log(b)
//       const plainObject = Object.assign({}, b);
//       return json(plainObject)
//       return ({requirements:JSON.stringify(b)});
//     }
//     catch(err){
//       console.log(err)
//       return {success:false, message:err.message??""}
//     }

//   }
// };