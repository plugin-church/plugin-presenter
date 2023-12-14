<script lang="ts">
	import { onMount } from 'svelte';
	import type { Message } from '$lib/types/messages';

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import Sidebar from './(components)/sidebar.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import SlidesPreview from './(components)/slides-preview.svelte';
	import { presentation, type Presentation, type PresentationItem } from '$lib/presentation';
	import type { Slide } from '$lib/types/slide';
	import { SearchIcon } from 'lucide-svelte';

	let itemIndex: number | null = null;
	let slideIndex = 0;
	let slidesChannel: BroadcastChannel;
	let monitor: Window | null = null;

	$: slides = generateSlides($presentation);

	onMount(() => {
		if ($presentation.items.length) {
			itemIndex = 0;
		}
		slidesChannel = new BroadcastChannel('slides');
		window.addEventListener('keydown', keyListener);
		window.addEventListener('wheel', scrollListener);

		return () => {
			window.removeEventListener('keydown', keyListener);
			window.removeEventListener('wheel', scrollListener);
		};
	});

	function keyListener(e: KeyboardEvent) {
		// if the focused element is not the body ignore
		if (document.activeElement?.tagName != 'BODY') return;
		switch (e.key) {
			case ' ':
			case 'ArrowRight':
			case 'ArrowDown':
				e.preventDefault();
				nextSlide();
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
				e.preventDefault();
				prevSlide();
				break;
		}
	}

	function scrollListener(event: WheelEvent) {
		if (document.activeElement?.tagName != 'BODY') return;
		const didScrollDown = event.deltaY > 0;

		didScrollDown ? nextSlide() : prevSlide();
	}

	function parseLyrics(content: string | null): string[] {
		if (!content) return [];
		const lines = content.split(/\r?\n/);

		const sections = [];
		for (let i = 0; i < lines.length; i++) {
			if (!lines[i]) continue;
			if (lines[i].startsWith('[')) continue;

			const index = sections.push(lines[i]) - 1;
			if (i + 1 == lines.length) break;
			if (!lines[i + 1]) continue;

			i++;
			sections[index] += '\n' + lines[i];
		}

		return sections;
	}

	function generateSlides(pres: Presentation) {
		let slides: Slide[] = [];

		for (const item of pres.items) {
			switch (item.type) {
				case 'song':
					slides.push({ type: 'text', content: `<strong>${item.name}</strong>` });
					const lyrics = parseLyrics(item.content);
					for (const lyric of lyrics) {
						slides.push({
							type: 'lyrics',
							content: lyric
						});
					}
					slides.push({ type: 'text', content: '' });
					break;
				case 'image':
					slides.push({
						type: 'image',
						content: item.content
					});
					break;
			}
		}

		return slides;
	}

	function openMonitor() {
		monitor = window.open(
			`./monitor?title=Song`,
			'plugin-presenter-monitor-live',
			'toolbar=no,scrollbars=no,resizable=yes,width=800,height=600'
		);
		if (!monitor) return;
		monitor.addEventListener('message', (event) => {
			if (event.data == 'mounted') setSlide(slideIndex);
			if (event.data == 'closing') monitor = null;
		});
	}

	function closeMonitor() {
		if (!monitor) return;
		monitor.close();
		monitor = null;
	}

	function setSlide(newIndex: number) {
		if (newIndex < 0) return;
		if (newIndex > slides.length - 1) return;
		slidesChannel?.postMessage({
			direction: newIndex >= slideIndex ? 'next' : 'previous',
			slide: slides[newIndex]
		} as Message);
		slideIndex = newIndex;
	}

	function nextSlide() {
		setSlide(slideIndex + 1);
	}

	function prevSlide() {
		setSlide(slideIndex - 1);
	}

	function handleChange(key: keyof PresentationItem) {
		return (e: any) => {
			presentation.update(itemIndex!, { [key]: e.target.value ?? '' });
		};
	}
</script>

<div
	class="flex flex-row flex-wrap w-screen h-screen gap-4 p-4 lg:flex-nowrap justify-items-center"
>
	<div
		class="flex flex-col items-center w-full max-w-screen-md gap-2 basis-full md:basis-auto md:max-w-[256px]"
	>
		<Sidebar on:navigate={(e) => (itemIndex = e.detail)} />
	</div>
	<div
		class="flex flex-col items-center justify-center flex-grow w-full gap-4 sm:basis-full md:basis-1/2 lg:basis-9/12"
	>
		{#if itemIndex != null}
			<div class="flex flex-row w-full gap-2">
				<Input
					class="w-full col-span-10"
					placeholder="Song Name"
					value={$presentation.items[itemIndex]?.name}
					on:input={handleChange('name')}
				/>
				<!-- <Button variant="secondary" size="icon" class="w-12">
				<SearchIcon class="w-4 h-4" />
			</Button> -->
			</div>
			<Textarea
				class="w-full h-1/2"
				value={$presentation.items[itemIndex]?.content}
				on:input={handleChange('content')}
				placeholder="Enter lyrics here"
			/>
			<div>
				<Button class="mr-6" on:click={monitor ? closeMonitor : openMonitor}>
					{monitor ? 'Close Monitor' : 'Open Monitor'}
				</Button>
				<Button on:click={prevSlide} disabled={slideIndex == 0}>Previous</Button>
				<Button on:click={nextSlide} disabled={!slides.length || slides.length == slideIndex + 1}
					>Next</Button
				>
			</div>
		{/if}
	</div>
	<div
		class="flex flex-col items-center w-full max-h-screen gap-2 overflow-y-scroll lg:overflow-y-hidden basis-full lg:basis-4/6"
	>
		{#if $presentation.items.length}
			<SlidesPreview
				bind:slides
				bind:currentIndex={slideIndex}
				on:change={(e) => (slideIndex = e.detail)}
			/>
		{/if}
	</div>
</div>
