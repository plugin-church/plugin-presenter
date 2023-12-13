<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { TrashIcon } from 'lucide-svelte';
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger asChild let:builder>
		<Button variant="destructive" size="icon" builders={[builder]}>
			<TrashIcon class="h-4 w-4" />
		</Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This item will be removed from the presentation and cannot be
				recovered.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action asChild let:builder>
				<Button variant="destructive" builders={[builder]} on:click>Continue</Button>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
