<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { presentation, type PresentationStyle } from '$lib/presentation';

	// this is not particularly good, but I've got limited time right now
	let currentValue: string | number;

	function snapshotStyle(key: keyof PresentationStyle) {
		return () => {
			currentValue = $presentation.items[$presentation.selectedIndex!].style?.[key] ?? '';
		};
	}

	function handleSaveBackground() {
		presentation.setStyle($presentation.selectedIndex!, 'background', currentValue as string);
	}

	function handleSaveTextColor() {
		presentation.setStyle($presentation.selectedIndex!, 'fontColor', currentValue as string);
	}
</script>

<div class="flex flex-row w-full mb-4 space-x-2">
	<AlertDialog.Root>
		<AlertDialog.Trigger asChild let:builder>
			<Button variant="outline" builders={[builder]} on:click={snapshotStyle('background')}>
				Background
			</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Background</AlertDialog.Title>
			</AlertDialog.Header>
			<Input bind:value={currentValue} placeholder="Background Color / Image URL" />
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action asChild let:builder>
					<Button variant="default" builders={[builder]} on:click={handleSaveBackground}>
						Save
					</Button>
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
	<AlertDialog.Root>
		<AlertDialog.Trigger asChild let:builder>
			<Button variant="outline" builders={[builder]} on:click={snapshotStyle('fontColor')}>
				Text Color
			</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Text Color</AlertDialog.Title>
			</AlertDialog.Header>
			<Input type="color" bind:value={currentValue} placeholder="Text Color" />
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action asChild let:builder>
					<Button variant="default" builders={[builder]} on:click={handleSaveTextColor}>
						Save
					</Button>
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
