
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { pb } from '$lib/pocketbase'
  


export const actions: Actions = {
  register: async ({ locals, request }) => {
    console.log(request)
    const data = Object.fromEntries(await request.formData()) as {
      email: string
      password: string
      passwordConfim:string
    }
    console.log(data)
    let res;
    try {
        // console.log(locals)
      res=await pb
        .collection('users')
        .listAuthMethods()
    } catch (e) {
      console.error(e)
      throw e
    }
    console.log(res);
    // console.log(pb.authStore.exportToCookie())
    // return {logged:true, st:pb.authStore.exportToCookie()}
    return {logged:true, data:data}
    // throw redirect(303, '/')
  },
}