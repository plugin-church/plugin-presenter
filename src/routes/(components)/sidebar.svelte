<script lang="ts">
	import {
		PlusIcon,
		MusicIcon,
		UnplugIcon,
		TextIcon,
		ImageIcon,
		XCircleIcon,
		MonitorIcon
	} from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';
	import { presentation, type PresentationItem } from '$lib/presentation';
	import DeleteButton from '$lib/components/delete-button.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import TextEditor from './text-editor.svelte';
	import Branding from './branding.svelte';
	import { EditIcon } from 'lucide-svelte';
	import RenameButton from './rename-button.svelte';

	const iconProps = { class: 'mr-2 h-4 w-4' };

	function onNavigate(index: number) {
		presentation.select(index);
	}

	const typeIcon: Record<PresentationItem['type'], any> = {
		song: MusicIcon,
		text: TextIcon,
		image: ImageIcon
	};

	export let monitor: Window | null = null;
	function openMonitor() {
		monitor = window.open(
			`./monitor?title=Song`,
			'plugin-presenter-monitor-live',
			'toolbar=no,scrollbars=no,resizable=yes,width=800,height=600'
		);
		if (!monitor) return;
		monitor.addEventListener('message', (event) => {
			if (event.data == 'closing') monitor = null;
		});
	}

	function closeMonitor() {
		if (!monitor) return;
		monitor.close();
		monitor = null;
	}
</script>

<div class="w-full h-full pb-4 space-y-4">
	<div class="flex flex-col h-full px-0">
		<div class="flex flex-row items-baseline px-4 mb-2 space-x-1">
			<h2 class="text-lg font-semibold tracking-tight">
				{$presentation.name}
			</h2>
			<RenameButton bind:value={$presentation.name} onSave={presentation.rename} />
		</div>

		<div class="space-y-2">
			{#each $presentation.items as item, index}
				<div class="flex space-x-2">
					<Button
						variant={$presentation.selectedIndex == index ? 'secondary' : 'outline'}
						class="justify-start w-full"
						on:click={() => onNavigate(index)}
					>
						<svelte:component this={typeIcon[item.type]} {...iconProps} />
						{item.name ?? item.type}
					</Button>
					<DeleteButton
						on:click={() => {
							presentation.delete(index);
						}}
					/>
				</div>
			{/each}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button class="justify-start w-full" builders={[builder]}>
						<PlusIcon {...iconProps} />
						Add
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content sameWidth>
					<DropdownMenu.Item
						class="text-base font-semibold"
						on:click={() => presentation.add({ type: 'song', name: 'New Song', content: '' })}
					>
						<MusicIcon {...iconProps} />
						Song
					</DropdownMenu.Item>
					<DropdownMenu.Item
						class="text-base font-semibold"
						on:click={() => presentation.add({ type: 'text', name: 'New Text', content: '' })}
					>
						<TextIcon {...iconProps} />
						Text
					</DropdownMenu.Item>
					<DropdownMenu.Item
						class="text-base font-semibold"
						on:click={() => presentation.add({ type: 'image', name: 'New Image', content: '' })}
					>
						<ImageIcon {...iconProps} />
						Image
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<div class="flex-grow h-full"></div>
		<Button
			class="justify-start w-full"
			variant={monitor ? 'destructive' : 'default'}
			on:click={monitor ? closeMonitor : openMonitor}
		>
			{#if monitor}
				<XCircleIcon {...iconProps} />
				Close Monitor
			{:else}
				<MonitorIcon {...iconProps} />
				Open Monitor
			{/if}
		</Button>
	</div>
	<!-- Library Section -->
	<!-- <div class="px-3 py-2">
			<h2 class="px-4 mb-2 text-lg font-semibold tracking-tight">Library</h2>
			<div class="space-y-1">
				<Button variant="ghost" class="justify-start w-full">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="w-4 h-4 mr-2"
					>
						<path d="M21 15V6" />
						<path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
						<path d="M12 12H3" />
						<path d="M16 6H3" />
						<path d="M12 18H3" />
					</svg>
					Playlists
				</Button>
			</div>
		</div> -->
</div>
