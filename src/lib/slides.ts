import { persisted } from 'svelte-persisted-store';
import type { PresentationStyle } from './presentation';
import { get } from 'svelte/store';
import { debounce } from 'lodash';

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

export const setSlide = debounce((newIndex: number) => {
	if (newIndex < 0 || newIndex > get(slides).items.length - 1) return;
	slides.update((x) => ({ index: newIndex, items: x.items }));
}, 50);

export function nextSlide() {
	setSlide(get(slides).index + 1);
}

export function prevSlide() {
	setSlide(get(slides).index - 1);
}
