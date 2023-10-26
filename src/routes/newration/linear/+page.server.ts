import type { PageServerLoad } from "./$types";
import {animals} from "$lib/animaldata"

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