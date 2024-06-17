import { persisted } from 'svelte-persisted-store';
import type { PresentationStyle } from './presentation';

export type SlideType = 'lyrics' | 'image' | 'text' | 'filler';
export type Direction = 'next' | 'previous';

export type Slide = {
	type: SlideType;
	content: string;
	style?: PresentationStyle;
};

export const slides = persisted<{ index: number; items: Slide[] }>(
	'slides',
	{ index: 0, items: [] },
	{ storage: 'local', syncTabs: true }
);
