<script lang="ts">
	import { page } from '$app/stores';

	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Button from '$lib/components/ui/button/button.svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import List from '$lib/renderers/List.svelte';
	import { derived } from 'svelte/store';
	import { type Slide, slides, nextSlide, prevSlide } from '$lib/slides';
	import type { PresentationStyle } from '$lib/presentation';
	import Hr from '$lib/renderers/Hr.svelte';

	// let message: Message | null;

	// let channel: BroadcastChannel;
	let isFullscreen = false;
	let isHovered = false;

	onMount(() => {
		// channel = new BroadcastChannel('slides');
		// channel.addEventListener('message', messageListener);

		// const color = $page.url.searchParams.get('color');
		// if (color) {
		// 	document.body.style.backgroundColor = color;
		// }

		window.postMessage('mounted');
		window.addEventListener('beforeunload', () => {
			window.postMessage('closing');
		});
		document.addEventListener('fullscreenchange', () => {
			isFullscreen = Boolean(document.fullscreenElement);
		});
		document.addEventListener('mouseleave', () => {
			isHovered = false;
		});
		document.addEventListener('mouseenter', () => {
			isHovered = true;
		});

		// return () => {
		// 	channel.removeEventListener('message', messageListener);
		// };
	});

	// function messageListener(event: MessageEvent) {
	// 	message = event.data;
	// }

	function topValue() {
		return -window.innerHeight;
	}

	function bottomValue() {
		return window.innerHeight;
	}

	function toggleFullScreen() {
		if (!isFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}

	function buildStyles(style: PresentationStyle) {
		const styles: string[] = [];
		if (style.background) {
			styles.push(
				`background: ${
					isValidUrl(style.background) ? `url('${style.background}')` : style.background
				}`
			);
			styles.push('background-position: center');
			styles.push('background-size: cover');
		}

		if (style.fontFamily) {
			styles.push(`font-family: ${style.fontFamily}`);
		}

		if (style.fontColor) {
			styles.push(`color: ${style.fontColor}`);
			styles.push(`--border-color: ${style.fontColor}`);
		}

		return styles.join(';');
	}

	function isValidUrl(s: string) {
		try {
			new URL(s);
			return true;
		} catch (err) {
			return false;
		}
	}

	const state = derived(slides, (x) => ({
		index: x.index,
		direction: x.index >= $previousIndex ? 'next' : 'previous',
		slide: x.items?.[x.index]
	}));
	const previousIndex = derived(slides, (x) => x.index, 0);

	$: styles = buildStyles($state.slide?.style ?? {});
</script>

<div
	class="flex flex-col items-center justify-center h-screen overflow-hidden transition-[background] duration-500"
	style={styles}
	role="none"
	on:click={(e) => {
		let middlehalf = window.innerHeight / 2;
		if (e.clientY > middlehalf) {
			nextSlide();
		} else {
			prevSlide();
		}
	}}
>
	{#if isHovered}
		<div transition:fade={{ duration: 150 }}>
			<Button
				variant="outline"
				class="absolute opacity-50 right-2 top-2"
				on:click={() => toggleFullScreen()}
			>
				{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
			</Button>
		</div>
	{/if}
	<div class="grid">
		{#if $state.slide}
			{#key `${$state.slide.type}-${$state.slide.content}`}
				{#if $state.slide.type == 'lyrics'}
					<h2
						class="text-2xl font-semibold leading-normal tracking-tight text-center whitespace-pre-line transition-colors xl:text-7xl lg:text-6xl md:text-5xl sm:text-4xl line"
						in:fly|global={{
							duration: 500,
							y: bottomValue(), // $state.direction == 'next' ? bottomValue() : topValue(),
							opacity: 0.5,
							easing: quintOut
						}}
						out:fly|global={{
							duration: 500,
							y: topValue(), // $state.direction == 'next' ? topValue() : bottomValue(),
							opacity: 0.5,
							easing: quintOut
						}}
					>
						{$state.slide.content}
					</h2>
				{:else if $state.slide.type == 'text'}
					<h2
						class="font-semibold leading-normal tracking-tight text-center whitespace-pre-line transition-colors prose:text-inherit xl:text-7xl lg:text-5xl md:text-4xl sm:text-3xl lin prose-p:my-0 prose-hr:my-12"
						in:fly|global={{
							duration: 500,
							y: bottomValue(), // $state.direction == 'next' ? bottomValue() : topValue(),
							opacity: 0.5,
							easing: quintOut
						}}
						out:fly|global={{
							duration: 500,
							y: topValue(), // $state.direction == 'next' ? topValue() : bottomValue(),
							opacity: 0.5,
							easing: quintOut
						}}
					>
						<SvelteMarkdown
							source={$state.slide.content}
							renderers={{
								list: List,
								hr: Hr
							}}
						/>
					</h2>
				{:else if $state.slide.type == 'image'}
					<img class="object-contain h-screen" src={$state.slide.content} alt="slide" />
				{/if}
			{/key}
		{/if}
	</div>
</div>

<style>
	.grid > * {
		grid-area: 1/1/2/2;
	}
</style>
