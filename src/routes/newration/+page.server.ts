import type { Actions } from "@sveltejs/kit";

export async function load({  url }): Promise<{ ration_id: string; }> {
    const ration_id:string = url.searchParams.get('id')||"";
    return { ration_id };}

export const actions: Actions = {
    sendemail: async ({request})=>{
        const data=Object.fromEntries(await request.formData())
        return {e:data.email}
    }
    
};  