import { createContext } from 'svelte';
import type { Snippet } from 'svelte';

export const [getMobileSidebarOpenButton, setMobileSidebarOpenButton] = createContext<Snippet<[string]>>();
