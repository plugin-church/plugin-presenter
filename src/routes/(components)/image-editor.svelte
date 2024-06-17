<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import { presentation, type PresentationItem } from '$lib/presentation';

	export let itemIndex: number;

	function handleChange(key: keyof PresentationItem) {
		return (e: any) => {
			presentation.update(itemIndex!, { [key]: e.target.value ?? '' });
		};
	}
</script>

<div class="flex flex-col w-full gap-1.5">
	<Label class="px-0.5" for="name">Name</Label>
	<Input
		name="name"
		class="w-full col-span-10"
		placeholder="Name"
		value={$presentation.items[itemIndex]?.name}
		on:input={handleChange('name')}
	/>
</div>

<div class="flex flex-col w-full gap-1.5">
	<Label class="px-0.5" for="content">Image URL</Label>
	<Input
		name="content"
		class="w-full col-span-10"
		value={$presentation.items[itemIndex]?.content}
		on:input={handleChange('content')}
		placeholder="Enter Image URL here..."
	/>
</div>

{#if $presentation.items[itemIndex].content}
	<img src={$presentation.items[itemIndex].content} alt={$presentation.items[itemIndex]?.name} />
{/if}
