export type Direction = 'next' | 'previous';

export type LyricsMessage = {
	type: 'lyrics';
	direction: Direction;
	content: string;
};

export type Message = LyricsMessage;
