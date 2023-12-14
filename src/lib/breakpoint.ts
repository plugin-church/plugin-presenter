import { fullConfig } from '../../tailwind.config.js'; // Fix the path
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

type TailwindBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Breakpoint = 'xs' | TailwindBreakpoint;

export function getBreakpointValue(value: Breakpoint): number {
	if (value == 'xs') return 0;
	return +fullConfig.theme.screens[value].slice(0, fullConfig.theme.screens[value].indexOf('px'));
}

export function getCurrentBreakpoint(): Breakpoint {
	let currentBreakpoint: TailwindBreakpoint | undefined;
	let biggestBreakpointValue = 0;

	for (const breakpoint of Object.keys(fullConfig.theme.screens) as TailwindBreakpoint[]) {
		const breakpointValue = getBreakpointValue(breakpoint);
		if (breakpointValue > biggestBreakpointValue && window.innerWidth >= breakpointValue) {
			biggestBreakpointValue = breakpointValue;
			currentBreakpoint = breakpoint;
		}
	}

	return currentBreakpoint! ?? 'xs';
}

export const breakpoint = readable<Breakpoint>(browser ? getCurrentBreakpoint() : 'lg', (set) => {
	if (!browser) return;
	function resizeListener() {
		set(getCurrentBreakpoint());
	}

	window.addEventListener('resize', resizeListener);
	return () => {
		window.removeEventListener('resize', resizeListener);
	};
});
