<script lang="ts">
	import List from '$lib/renderers/List.svelte';
	import type { Slide } from '$lib/slides';
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';

	let container: HTMLDivElement | null;

	export let currentIndex: number;
	export let slides: Slide[];

	const dispatch = createEventDispatcher<{
		change: number;
	}>();

	function scrollIntoView(index: number) {
		if (!container) return;

		const element = document.getElementById(`slide-${index}`);

		console.log(container.offsetTop);
		container!.scrollTo({
			top: (element?.offsetTop ?? 0) - (window.innerHeight + container.offsetTop) / 2,
			behavior: 'smooth'
		});
	}

	$: scrollIntoView(currentIndex);
</script>

<div id="slides-container" class="w-full px-8 overflow-y-hidden" bind:this={container}>
	{#if slides.length}
		{#each slides as slide, index}
			{@const isActive = index == currentIndex}
			<div
				id={`slide-${index}`}
				class={cn(
					'lg:first:mt-[50vh] last:mb-[50vh] cursor-pointer select-none mb-8 transition-all delay-75 outline-none flex justify-center',
					!isActive ? 'opacity-50' : 'bg-primary bg-opacity-25 rounded-md',
					slide.type == 'image' ? 'p-4' : ''
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
					<p
						class="text-2xl prose text-center whitespace-pre-line dark:prose-invert prose-p:my-0 prose-hr:my-8"
					>
						{#if slide.content}
							<SvelteMarkdown source={slide.content} renderers={{ list: List }} />
						{:else}
							[Empty]
						{/if}
					</p>
				{:else if slide.type == 'image'}
					<img class="rounded-md max-h-72" src={slide.content} alt={`Slide ${index + 1}`} />
				{/if}
			</div>
		{/each}
	{/if}
</div>
