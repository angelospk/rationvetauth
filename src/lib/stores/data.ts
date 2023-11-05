import { writable, type Writable } from 'svelte/store';
import type { Feed, Column } from './types';
export const feeds:Writable<Feed[]> = writable([]);
export const metrics:Writable<Column[]> = writable([]);
export const userFeeds:Writable<Feed[]>= writable([]);
export const loadedTables:Writable<Boolean>=writable(false);
export const userRations:Writable<State[]>=writable([]);