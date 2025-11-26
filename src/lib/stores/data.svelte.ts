import type { Feed, Column, State } from './types';

// Global state using runes
// We use a class or an object with $state to hold the values.
// Since these are global, we can just export a state object or functions to access them.

class AppState {
    feeds = $state<Feed[]>([]);
    metrics = $state<Column[]>([]);
    userFeeds = $state<Feed[]>([]);
    loadedTables = $state<boolean>(false);
    userRations = $state<State[]>([]);
}

export const appState = new AppState();
