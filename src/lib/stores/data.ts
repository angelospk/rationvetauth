import { writable } from 'svelte/store';
export const feeds = writable([]);
export const metrics = writable([]);
export let userFeeds= writable([]);
export let loadedTables=writable(false);