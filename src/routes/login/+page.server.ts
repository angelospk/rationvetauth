
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { pb } from '$lib/pocketbase'

export const actions: Actions = {
  login: async ({ locals, request }) => {
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
      throw e
    }
    // console.log(pb.authStore.exportToCookie())
    return {logged:true, st:pb.authStore.exportToCookie()}
    throw redirect(303, '/')
  },
}