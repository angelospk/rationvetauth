import { writable, type Writable } from 'svelte/store';
import type { Feed, Column } from './types';
export const feeds:Writable<Feed[]> = writable([]);
export const metrics:Writable<Column[]> = writable([]);
export let userFeeds:Writable<Feed[]>= writable([]);
export let loadedTables:Writable<Boolean>=writable(false);