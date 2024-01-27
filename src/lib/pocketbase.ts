import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
// import { POCKETBASE_URL } from '$env/static/private';

/**
 * Creates a new instance of PocketBase with the specified URL.
 *
 * @return {PocketBase} The new instance of PocketBase.
 */
export function createInstance() {
  // const url = import.meta.env.POCKETBASE_URL;
  // console.log("pocket:",url);
  return new PocketBase("https://rationvetauth.pockethost.io/");
  }
  
  export const pb = createInstance()
  export const currentUser=writable(pb.authStore.model);
  pb.authStore.onChange(()=>{
    currentUser.set(pb.authStore.model)
})