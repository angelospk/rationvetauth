import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

// export const pb= new PocketBase('https://ration.haroldpoi.repl.co');


export function createInstance() {
    return new PocketBase('https://ration.haroldpoi.repl.co');
  }
  
  export const pb = createInstance()
  export const currentUser=writable(pb.authStore.model);
  pb.authStore.onChange((auth)=>{
    console.log("authstore changed", pb.authStore)
    currentUser.set(pb.authStore.model)
})