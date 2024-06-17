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

<div class="flex flex-row w-full gap-2 sm:min-h-4/6">
	<div class="flex flex-col w-full gap-1.5">
		<Label class="px-0.5" for="name">Name</Label>
		<Input
			name="name"
			class="w-full col-span-10"
			placeholder="Song Name"
			value={$presentation.items[itemIndex]?.name}
			on:input={handleChange('name')}
		/>
	</div>

	<!-- <Button variant="secondary" size="icon" class="w-12">
  <SearchIcon class="w-4 h-4" />
</Button> -->
</div>
<div class="flex flex-col w-full h-1/2 gap-1.5">
	<Label class="px-0.5" for="content">Lyrics</Label>
	<Textarea
		name="content"
		class="w-full h-full"
		value={$presentation.items[itemIndex]?.content}
		on:input={handleChange('content')}
		placeholder="Enter lyrics here"
	/>
</div>
