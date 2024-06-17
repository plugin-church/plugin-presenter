<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { EditIcon } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	export let value: string;
	export let onSave: (newValue: string) => void;

	let currentValue: string;

	function handleOpen() {
		currentValue = value;
	}

	function handleSave() {
		onSave?.(currentValue);
	}
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger asChild let:builder>
		<Button
			variant="ghost"
			size="icon"
			class="w-[24px] h-[24px]"
			builders={[builder]}
			on:click={handleOpen}
		>
			<EditIcon class="w-3 h-3" />
		</Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Rename Presentation</AlertDialog.Title>
		</AlertDialog.Header>
		<Input bind:value={currentValue} placeholder="Presentation Name" />
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action asChild let:builder>
				<Button variant="default" builders={[builder]} on:click={handleSave}>Save</Button>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
