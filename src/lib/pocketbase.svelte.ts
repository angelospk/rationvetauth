import PocketBase from 'pocketbase';
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

// Reactive state for current user
// We use a simple object to hold the user state so it can be updated
export const authState = $state({ user: pb.authStore.model });

pb.authStore.onChange(() => {
    authState.user = pb.authStore.model;
});
