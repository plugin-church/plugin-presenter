<script lang="ts">
	import {
		breakpoint as windowBreakpoint,
		type Breakpoint,
		getBreakpointValue
	} from '$lib/breakpoint';

	export let disabled = false;
	export let breakpoint: Breakpoint;
	export let direction: 'higher' | 'lower' | 'none';

	$: isHidden = !disabled && getIsHidden($windowBreakpoint);

	function getIsHidden(windowBreakpoint: Breakpoint) {
		switch (direction) {
			case 'lower':
				return getBreakpointValue(windowBreakpoint) <= getBreakpointValue(breakpoint);
			case 'higher':
				return getBreakpointValue(windowBreakpoint) >= getBreakpointValue(breakpoint);
			case 'none':
				return windowBreakpoint == breakpoint;
		}
	}
</script>

{#if !isHidden}
	<slot />
{/if}
