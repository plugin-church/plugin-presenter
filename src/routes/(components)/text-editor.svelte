<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

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
<div class="flex flex-col w-full h-1/2 gap-1.5">
	<Label class="px-0.5" for="content">Text</Label>
	<Textarea
		name="content"
		class="w-full h-full"
		value={$presentation.items[itemIndex]?.content}
		on:input={handleChange('content')}
		placeholder="Enter text here"
		rows={1}
	/>
</div>
