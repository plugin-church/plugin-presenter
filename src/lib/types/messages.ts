import type { Slide } from './slide';

export type Direction = 'next' | 'previous';
export type Message = {
	slide: Slide;
	direction: Direction;
};
