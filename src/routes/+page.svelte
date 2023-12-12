<script lang="ts">
	import { onMount } from 'svelte';
	import type { LyricsMessage } from '../messages';

	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	let lyricContainer: HTMLDivElement | null;
	let channel: BroadcastChannel;
	onMount(() => {
		channel = new BroadcastChannel('lyrics');
		window.addEventListener('keydown', (e) => {
			switch (e.key) {
				case ' ':
				case 'ArrowRight':
					e.preventDefault();
					displayLyric(index + 1);
					break;
				case 'ArrowLeft':
					e.preventDefault();
					displayLyric(index - 1);
					break;
			}
		});
	});

	let content: string | null;

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

	$: parsed = parseLyrics(content);

	function scrollLyricIntoView() {
		lyricContainer
			?.querySelector(`#lyric-${index}`)
			?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	let monitor: Window | null = null;
	function openMonitor() {
		monitor = window.open(
			`./monitor?title=Song`,
			'plugin-presenter-monitor',
			'toolbar=no,scrollbars=no,resizable=yes,width=800,height=600'
		);
		if (!monitor) return;
		monitor.addEventListener('message', (event) => {
			if (event.data == 'mounted') displayLyric(index);
			if (event.data == 'closing') monitor = null;
		});
	}

	function closeMonitor() {
		if (!monitor) return;
		monitor.close();
		monitor = null;
	}

	let index = 0;
	function displayLyric(newIndex: number) {
		channel?.postMessage({
			type: 'lyrics',
			content: parsed[newIndex],
			direction: newIndex >= index ? 'next' : 'previous'
		} as LyricsMessage);
		index = newIndex;

		scrollLyricIntoView();
	}
</script>

<div class="grid grid-cols-2 justify-center w-screen h-screen">
	<div class="flex flex-col items-center justify-center max-w-screen-md gap-2">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
			Plugin Presenter
		</h1>
		<Textarea
			class="w-max"
			bind:value={content}
			rows={20}
			cols={70}
			placeholder="Enter lyrics here"
		/>
		<div>
			<Button class="mr-6" on:click={monitor ? closeMonitor : openMonitor}>
				{monitor ? 'Close Monitor' : 'Open Monitor'}
			</Button>
			<Button on:click={() => displayLyric(index - 1)} disabled={index == 0}>Previous</Button>
			<Button
				on:click={() => displayLyric(index + 1)}
				disabled={!parsed.length || parsed.length == index + 1}>Next</Button
			>
		</div>
	</div>
	<div class="flex flex-col items-center max-w-screen-md gap-2 overflow-y-hidden max-h-screen p-4">
		<div bind:this={lyricContainer}>
			{#if parsed.length}
				{#each parsed as section, i}
					<p
						id={`lyric-${i}`}
						class="text-xl whitespace-pre-line text-center mb-4 cursor-pointer select-none"
						class:opacity-50={i != index}
						on:click={() => displayLyric(i)}
					>
						{section}
					</p>
				{/each}
			{/if}
		</div>
	</div>
</div>
