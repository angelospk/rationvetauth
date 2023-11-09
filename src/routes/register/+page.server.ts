
import { error, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { pb } from '$lib/pocketbase'
  


export const actions: Actions = {
  register: async ({ request }) => {
    console.log(request)
    const data = Object.fromEntries(await request.formData()) as {
      email: string
      password: string
      passwordConfim:string
      name:string
      justify: string
    }
    // console.log(data);
    data.Student=data.Student=="1"?true:false;
    let res;
    try {
        // console.log(locals)
      res=await pb
        .collection('users').create(data)
      await pb.collection('users').requestVerification(data.email)
    } catch (e) {
      console.error(e)
      throw e
    }
    console.log(res);
    // throw redirect(303, '/login')
    // console.log(pb.authStore.exportToCookie())
    return {registered:true}
    // throw error (404);
    return {logged:true, data:res}
    // throw redirect(303, '/')
  },
}