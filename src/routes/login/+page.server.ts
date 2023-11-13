
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { pb } from '$lib/pocketbase'
import { error } from 'console';
  



export const actions: Actions = {
  login: async ({  request }) => {
    const data = Object.fromEntries(await request.formData()) as {
      email: string
      password: string

    }
    try {
        // console.log(locals)
      await pb
        .collection('users')
        .authWithPassword(data.email, data.password)
    } catch (e) {
      console.error(e)
      throw error (e)
    }
    if (pb.authStore.model && pb.authStore.model?.verified){return {verified:true, st:pb.authStore.exportToCookie()}}
    else {return {verified: false, email:data.email}}
    // console.log(pb.authStore.exportToCookie())
    
    throw redirect(303, '/')
  },
}