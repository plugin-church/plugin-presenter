<script lang="ts">
	import { page } from '$app/stores';

	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Message } from '$lib/types/messages';
	import Button from '$lib/components/ui/button/button.svelte';

	let message: Message | null;

	let channel: BroadcastChannel;
	let isFullscreen = false;
	let isHovered = false;

	onMount(() => {
		channel = new BroadcastChannel('slides');
		channel.addEventListener('message', messageListener);

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
			isHovered = false;
		});
		document.addEventListener('mouseenter', () => {
			isHovered = true;
		});

		return () => {
			channel.removeEventListener('message', messageListener);
		};
	});

	function messageListener(event: MessageEvent) {
		message = event.data;
	}

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
</script>

<div class="flex flex-col h-screen items-center justify-center overflow-hidden">
	{#if isHovered}
		<div transition:fade={{ duration: 150 }}>
			<Button class="absolute right-2 top-2" on:click={() => toggleFullScreen()}>
				{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
			</Button>
		</div>
	{/if}
	<div class="grid">
		{#if message}
			{#key `${message.slide.type}-${message?.slide.content}`}
				{#if message.slide.type == 'lyrics'}
					<h2
						class="xl:text-7xl lg:text-5xl md:text-4xl sm:text-3xl font-semibold tracking-tight transition-colors text-center whitespace-pre-line line leading-normal"
						in:fly|global={{
							duration: 500,
							y: message.direction == 'next' ? bottomValue() : topValue(),
							opacity: 0.5,
							easing: quintOut
						}}
						out:fly|global={{
							duration: 500,
							y: message.direction == 'next' ? topValue() : bottomValue(),
							opacity: 0.5,
							easing: quintOut
						}}
					>
						{message.slide.content}
					</h2>
				{:else if message.slide.type == 'text'}
					<h2
						class="xl:text-7xl lg:text-5xl md:text-4xl sm:text-3xl font-semibold tracking-tight transition-colors text-center whitespace-pre-line line leading-normal"
						in:fly|global={{
							duration: 500,
							y: message.direction == 'next' ? bottomValue() : topValue(),
							opacity: 0.5,
							easing: quintOut
						}}
						out:fly|global={{
							duration: 500,
							y: message.direction == 'next' ? topValue() : bottomValue(),
							opacity: 0.5,
							easing: quintOut
						}}
					>
						{@html message.slide.content}
					</h2>
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
