<script lang="ts">
	import type { Slide } from '$lib/types/slide';
	import { createEventDispatcher } from 'svelte';

	let container: HTMLDivElement | null;

	export let currentIndex: number;
	export let slides: Slide[];

	const dispatch = createEventDispatcher<{
		change: number;
	}>();

	function scrollIntoView(index: number) {
		container
			?.querySelector(`#slide-${index}`)
			?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	$: scrollIntoView(currentIndex);
</script>

<div bind:this={container}>
	{#if slides.length}
		{#each slides as slide, index}
			<div
				id={`slide-${index}`}
				class="first:mt-[50vh] last:mb-[50vh] cursor-pointer select-none mb-8"
				class:opacity-50={index != currentIndex}
				on:click={() => dispatch('change', index)}
			>
				{#if slide.type == 'lyrics'}
					<p class="text-2xl whitespace-pre-line text-center">
						{slide.content}
					</p>
				{:else if slide.type == 'text'}
					<p class="text-2xl whitespace-pre-line text-center">
						{#if slide.content}
							{@html slide.content}
						{:else}
							[Empty]
						{/if}
					</p>
				{:else if slide.type == 'image'}
					<img src={slide.content} />
				{/if}
			</div>
		{/each}
	{/if}
</div>
