import type { Actions } from "@sveltejs/kit"
import { pb } from "$lib/pocketbase.svelte"
import { error } from "@sveltejs/kit"
export const actions: Actions = {
    profile: async ({  request }) => {
      const data = Object.fromEntries(await request.formData()) as any
      console.log(data);
      try {
          // console.log(locals)
        await pb
          .collection('users')
          .update(data.userId, {name: data.name, phone: data.phone, postalCode:data.postalCode})
      } catch (e) {
        console.error(e)
        throw error (500, e as any)
      }
      
      return {success: true}
      
    },
  }