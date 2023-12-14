<script lang="ts">
	import type { Slide } from '$lib/types/slide';
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	let container: HTMLDivElement | null;

	export let currentIndex: number;
	export let slides: Slide[];

	const dispatch = createEventDispatcher<{
		change: number;
	}>();

	function scrollIntoView(index: number) {
		container
			?.querySelector<HTMLDivElement>(`#slide-${index}`)
			?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
	}

	$: scrollIntoView(currentIndex);
</script>

<div id="slides-container" bind:this={container}>
	{#if slides.length}
		{#each slides as slide, index}
			{@const isActive = index == currentIndex}
			<div
				id={`slide-${index}`}
				class={cn(
					'lg:first:mt-[50vh] last:mb-[50vh] cursor-pointer select-none mb-8 transition-all delay-75 outline-none',
					!isActive ? 'opacity-50' : 'bg-primary bg-opacity-25 rounded-md'
				)}
				role="button"
				tabindex={index + 1}
				on:focus={() => dispatch('change', index)}
			>
				{#if slide.type == 'lyrics'}
					<p class="text-2xl text-center whitespace-pre-line">
						{slide.content}
					</p>
				{:else if slide.type == 'text'}
					<p class="text-2xl text-center whitespace-pre-line">
						{#if slide.content}
							{@html slide.content}
						{:else}
							[Empty]
						{/if}
					</p>
				{:else if slide.type == 'image'}
					<img src={slide.content} alt={`Slide ${index + 1}`} />
				{/if}
			</div>
		{/each}
	{/if}
</div>
