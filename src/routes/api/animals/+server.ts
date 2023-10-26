import {animals} from "$lib/animaldata"

export const GET=(async()=>{
    const simplifiedAnimals = {};
    for (const [animalType, animalData] of Object.entries(animals)) {
        simplifiedAnimals[animalType] = {};
        
        for (const [category, categoryData] of Object.entries(animalData)) {
          simplifiedAnimals[animalType][category] = Object.keys(categoryData);
        }
      }
    //   return ;
    return new Response(JSON.stringify(simplifiedAnimals));
})