import { animals } from "$lib/animaldata";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({request}) => {
    const data=Object.fromEntries(await request.formData())
    console.log(data)
    try{
      const {animal, selection, subselection}=data;
      const b=animals[animal][selection][subselection]
      console.log(b)
    //   const plainObject = Object.assign({}, b);
      return json(b)
      return ({requirements:JSON.stringify(b)});
    }
    catch(err){
      console.log(err)
      return json( {success:false, message:err.message??""})
    }

    return new Response();
};