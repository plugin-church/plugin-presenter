<script lang="ts">
	import { onMount } from 'svelte';

	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import Input from '$lib/components/ui/input/input.svelte';
	import Hidden from '$lib/components/ui/hidden/hidden.svelte';

	import Sidebar from './(components)/sidebar.svelte';
	import type { Slide } from '$lib/slides';
	import SlidesPreview from './(components)/slides-preview.svelte';
	import { presentation, type Presentation, type PresentationItem } from '$lib/presentation';
	import { ChevronLeftIcon, ChevronRightIcon, MenuIcon, SearchIcon } from 'lucide-svelte';
	import { breakpoint } from '$lib/breakpoint';
	import SongEditor from './(components)/song-editor.svelte';
	import TextEditor from './(components)/text-editor.svelte';
	import ImageEditor from './(components)/image-editor.svelte';
	import { fly } from 'svelte/transition';
	import Branding from './(components)/branding.svelte';
	import { slides } from '$lib/slides';
	import { debounce } from 'lodash';
	import ImportButton from './(components)/import-button.svelte';
	import ExportButton from './(components)/export-button.svelte';
	import StyleMenu from './(components)/style-menu.svelte';

	$: slides.set({ index: 0, items: generateSlides($presentation) });

	onMount(() => {
		window.addEventListener('keydown', keyListener);

		return () => {
			window.removeEventListener('keydown', keyListener);
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

	function generateSlides({ items }: Presentation) {
		let slides: Slide[] = [];

		for (const item of items) {
			switch (item.type) {
				case 'song':
					if (item.name)
						slides.push({
							type: 'text',
							content: `<strong>${item.name}</strong>`,
							style: item.style
						});
					if (!item.content) break;
					const lyrics = parseLyrics(item.content);
					for (const lyric of lyrics) {
						slides.push({
							type: 'lyrics',
							content: lyric,
							style: item.style
						});
					}
					slides.push({ type: 'text', content: '' });
					break;
				case 'text':
					if (!item.content) break;
					slides.push({ type: 'text', content: item.content, style: item.style });
					break;
				case 'image':
					if (!item.content) break;
					slides.push({
						type: 'image',
						content: item.content,
						style: item.style
					});
					break;
			}
		}

		return slides;
	}

	const setSlide = debounce((newIndex: number) => {
		if (newIndex < 0 || newIndex > $slides.items.length - 1) return;
		slides.update((x) => ({ index: newIndex, items: x.items }));
	}, 50);

	function nextSlide() {
		setSlide($slides.index + 1);
	}

	function prevSlide() {
		setSlide($slides.index - 1);
	}
</script>

<div class="flex flex-col h-screen">
	<div class="border-b">
		<div class="flex items-center gap-2 p-3">
			<Hidden breakpoint="lg" direction="higher">
				<Sheet.Root>
					<Sheet.Trigger asChild let:builder>
						<Button size="icon" builders={[builder]} variant="outline">
							<MenuIcon />
						</Button>
						<!-- <h1 class="text-2xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
							{$presentation.name}
						</h1> -->
					</Sheet.Trigger>
					<Sheet.Content side="left" class="p-2">
						<Sidebar />
					</Sheet.Content>
				</Sheet.Root>
			</Hidden>
			<Branding />
			<div class="flex items-center ml-auto space-x-2">
				<ImportButton />
				<ExportButton />
			</div>
		</div>
	</div>
	<div
		class="flex flex-row flex-wrap w-screen h-full min-h-0 gap-4 px-4 lg:flex-nowrap justify-items-center grow"
	>
		<Hidden breakpoint="md" direction="lower">
			<div
				class="flex flex-col items-center w-full max-w-screen-md gap-2 basis-full md:basis-auto md:max-w-[256px] pt-4"
			>
				<Sidebar />
			</div>
			<div class="border-r" />
		</Hidden>

		<div
			class="flex flex-col items-center flex-grow w-full gap-4 pt-4 sm:basis-full md:basis-1/2 lg:basis-9/12"
		>
			{#if $presentation.selectedIndex != undefined && $presentation.items?.[$presentation.selectedIndex]}
				{@const selectedItem = $presentation.items?.[$presentation.selectedIndex]}
				<StyleMenu />

				{#if selectedItem.type == 'song'}
					<SongEditor itemIndex={$presentation.selectedIndex} />
				{:else if selectedItem.type == 'text'}
					<TextEditor itemIndex={$presentation.selectedIndex} />
				{:else if selectedItem.type == 'image'}
					<ImageEditor itemIndex={$presentation.selectedIndex} />
				{/if}
				<!-- <div>
					<Button on:click={prevSlide} disabled={$slides.index == 0}>Previous</Button>
					<Button
						on:click={nextSlide}
						disabled={!$slides.items.length || $slides.items.length == $slides.index + 1}
					>
						Next
					</Button>
				</div> -->
			{/if}
		</div>
		<div
			class="flex flex-col items-center w-full h-full gap-2 overflow-y-visible lg:overflow-y-hidden basis-full lg:basis-4/6"
			on:wheel={(e) => {
				e.preventDefault();
				const didScrollDown = e.deltaY > 0;

				didScrollDown ? nextSlide() : prevSlide();
			}}
		>
			{#if $presentation.items.length}
				<SlidesPreview
					bind:slides={$slides.items}
					bind:currentIndex={$slides.index}
					on:change={(e) => setSlide(e.detail)}
				/>
			{/if}
		</div>
		<Hidden breakpoint="sm" direction="higher">
			<div
				class="fixed bottom-0 left-0 right-0 w-full p-2"
				transition:fly={{ duration: 500, y: 50 }}
			>
				<div
					class="grid items-center justify-center w-full grid-cols-2 gap-1 p-1 rounded-md h-14 bg-muted text-muted-foreground"
				>
					<button
						on:click={prevSlide}
						class="h-12 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-foreground shadow-sm"
					>
						<ChevronLeftIcon />
						Previous
					</button>
					<button
						on:click={nextSlide}
						class="h-12 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-foreground shadow-sm"
					>
						Next
						<ChevronRightIcon />
					</button>
				</div>
			</div>
		</Hidden>
	</div>
</div>
