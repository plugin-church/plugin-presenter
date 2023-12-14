<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	import { presentation, type PresentationItem } from '$lib/presentation';

	export let itemIndex: number;

	function handleChange(key: keyof PresentationItem) {
		return (e: any) => {
			presentation.update(itemIndex!, { [key]: e.target.value ?? '' });
		};
	}
</script>

<Input
	class="w-full col-span-10"
	placeholder="Name"
	value={$presentation.items[itemIndex]?.name}
	on:input={handleChange('name')}
/>
<Textarea
	class="w-full"
	value={$presentation.items[itemIndex]?.content}
	on:input={handleChange('content')}
	placeholder="Enter text here"
	rows={1}
/>
