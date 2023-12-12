<script lang="ts">
	import { page } from '$app/stores';

	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { LyricsMessage } from '../../messages';

	let lyric: LyricsMessage | null = {
		type: 'lyrics',
		content: $page.url.searchParams.get('title') ?? '',
		direction: 'next'
	};
	let channel: BroadcastChannel;
	onMount(() => {
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
	});

	function topValue() {
		return -window.innerHeight * 0.75;
	}

	function bottomValue() {
		return window.innerHeight * 0.75;
	}
</script>

<div class="flex h-screen items-center justify-center overflow-hidden">
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
