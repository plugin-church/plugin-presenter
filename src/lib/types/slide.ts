export type SlideType = 'lyrics' | 'image' | 'text' | 'filler';
export type Direction = 'next' | 'previous';

export type Slide = {
	type: SlideType;
	content: string;
};
