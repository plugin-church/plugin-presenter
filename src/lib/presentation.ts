import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type PresentationItem = {
	type: 'song' | 'image' | 'text';
	name?: string;
	content?: string;
};
export type Presentation = {
	name: string;
	items: PresentationItem[];
};

function store() {
	let initialValue = {
		name: 'New Presentation',
		items: []
	};

	if (browser) {
		const presentationJson = localStorage.getItem('presentation');
		if (presentationJson) initialValue = JSON.parse(presentationJson);
	}

	const { update, subscribe } = writable<Presentation>(initialValue);

	subscribe((p) => {
		if (browser) {
			localStorage.setItem('presentation', JSON.stringify(p));
		}
	});

	return {
		subscribe,
		add(item: PresentationItem) {
			update((p) => {
				p.items.push(item);
				return p;
			});
		},
		update(index: number, item: Partial<PresentationItem>) {
			update((p) => {
				p.items[index] = { ...p.items[index], ...item };
				return p;
			});
		},
		delete(index: number) {
			update((p) => {
				p.items.splice(index, 1);
				return p;
			});
		}
	};
}

export const presentation = store();
