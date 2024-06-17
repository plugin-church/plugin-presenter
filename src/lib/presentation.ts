import { persisted } from 'svelte-persisted-store';

export type PresentationStyle = {
	background?: string;
	fontFamily?: string;
	fontSize?: number;
	fontColor?: string;
};

export type PresentationItem = {
	type: 'song' | 'image' | 'text';
	name?: string;
	content?: string;
	style?: PresentationStyle;
};
export type Presentation = {
	name: string;
	items: PresentationItem[];
	selectedIndex?: number;
};

function store() {
	const initialValue = {
		name: 'New Presentation',
		items: []
	};

	const { set, update, subscribe } = persisted<Presentation>('presentation', initialValue);

	return {
		subscribe,
		load(presentation: Presentation) {
			set(presentation);
		},
		rename(newName: string) {
			update((p) => {
				p.name = newName;
				return p;
			});
		},
		select(index: number) {
			update((p) => {
				p.selectedIndex = index;
				return p;
			});
		},
		add(item: PresentationItem) {
			update((p) => {
				p.selectedIndex = p.items.push(item) - 1;
				return p;
			});
		},
		update(index: number, item: Partial<PresentationItem>) {
			update((p) => {
				p.items[index] = { ...p.items[index], ...item };
				return p;
			});
		},
		setStyle<K extends keyof PresentationStyle>(
			index: number,
			key: K,
			value: PresentationStyle[K]
		) {
			update((p) => {
				p.items[index].style ??= {};
				p.items[index].style![key] = value;
				console.log(p.items[index]);
				return p;
			});
		},
		delete(index: number) {
			update((p) => {
				const isSelected = p.selectedIndex == p.items.length - 1;
				p.items.splice(index, 1);
				if (isSelected) {
					p.selectedIndex = p.items.length - 1;
				}
				return p;
			});
		}
	};
}

export const presentation = store();
