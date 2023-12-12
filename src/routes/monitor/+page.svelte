<script lang="ts">
	import { page } from '$app/stores';

	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { LyricsMessage } from '../../messages';
	import Button from '$lib/components/ui/button/button.svelte';

	let lyric: LyricsMessage | null;

	let channel: BroadcastChannel;
	let isFullscreen = false;
	let isInFocus = false;

	onMount(() => {
		lyric = {
			type: 'lyrics',
			content: $page.url.searchParams.get('title') ?? '',
			direction: 'next'
		};
		channel = new BroadcastChannel('lyrics');
		channel.addEventListener('message', (event) => {
			const message: LyricsMessage = event.data;
			if (message?.type == 'lyrics') {
				lyric = message;
			}
		});

		const color = $page.url.searchParams.get('color');
		if (color) {
			document.body.style.backgroundColor = color;
		}

		window.postMessage('mounted');
		window.addEventListener('beforeunload', () => {
			window.postMessage('closing');
		});
		document.addEventListener('fullscreenchange', () => {
			isFullscreen = Boolean(document.fullscreenElement);
		});
		document.addEventListener('mouseleave', () => {
			isInFocus = false;
		});
		document.addEventListener('mouseenter', () => {
			isInFocus = true;
		});
	});

	function topValue() {
		return -window.innerHeight * 0.75;
	}

	function bottomValue() {
		return window.innerHeight * 0.75;
	}

	function toggleFullScreen() {
		if (!isFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
</script>

<div class="flex flex-col h-screen items-center justify-center overflow-hidden">
	{#if isInFocus}
		<div transition:fade={{ duration: 150 }}>
			<Button class="absolute right-2 top-2" on:click={() => toggleFullScreen()}>
				{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
			</Button>
		</div>
	{/if}
	<div class="grid">
		{#if lyric}
			{#key lyric.content}
				<h2
					class="xl:text-7xl lg:text-5xl md:text-4xl sm:text-3xl font-semibold tracking-tight transition-colors text-center whitespace-pre-line line leading-normal"
					in:fly={{
						duration: 500,
						y: lyric.direction == 'next' ? bottomValue() : topValue(),
						opacity: 0.5,
						easing: quintOut
					}}
					out:fly={{
						duration: 500,
						y: lyric.direction == 'next' ? topValue() : bottomValue(),
						opacity: 0.5,
						easing: quintOut
					}}
				>
					{lyric.content}
				</h2>
			{/key}
		{/if}
	</div>
</div>

<style>
	.grid > * {
		grid-area: 1/1/2/2;
	}
</style>
