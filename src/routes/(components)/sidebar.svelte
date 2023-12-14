<script lang="ts">
	import { PlusIcon, MusicIcon, UnplugIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';
	import { presentation } from '$lib/presentation';
	import DeleteButton from '$lib/components/delete-button.svelte';
	import { createEventDispatcher } from 'svelte';

	const iconProps = { class: 'mr-2 h-4 w-4' };

	const dispatch = createEventDispatcher<{
		navigate: number;
	}>();
</script>

<div class="w-full pb-4 space-y-4">
	<div class="px-0">
		<h1 class="flex items-center justify-center gap-2 text-2xl font-bold">
			<UnplugIcon class="text-primary" />
			Plugin Presenter
		</h1>
		<Separator class="my-4" />
		<h2 class="px-4 mb-2 text-lg font-semibold tracking-tight">{$presentation.name}</h2>
		<div class="space-y-2">
			{#each $presentation.items as item, index}
				<div class="flex space-x-2">
					<Button
						variant="secondary"
						class="justify-start w-full"
						on:click={() => dispatch('navigate', index)}
					>
						{#if item.type == 'song'}
							<MusicIcon {...iconProps} />
						{/if}
						{item.name}
					</Button>
					<DeleteButton on:click={() => presentation.delete(index)} />
				</div>
			{/each}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button class="justify-start w-full" builders={[builder]}>
						<PlusIcon {...iconProps} />
						Add
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-48">
					<DropdownMenu.Item
						class="text-base font-semibold"
						on:click={() => presentation.add({ type: 'song', name: 'New Song', content: '' })}
					>
						<MusicIcon {...iconProps} />
						Song
					</DropdownMenu.Item>
					<!-- <DropdownMenu.Item
						class="text-base font-semibold"
							on:click={() => presentation.add({ type: 'image', name: 'New Image', content: '' })}
						>
							Image
						</DropdownMenu.Item> -->
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
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
