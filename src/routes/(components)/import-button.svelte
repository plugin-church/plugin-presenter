<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { UploadIcon } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { download, selectAndReadFile } from '$lib/utils';
	import { presentation } from '$lib/presentation';

	async function handleImport() {
		const content = await selectAndReadFile({ accept: '.plgnpres' });
		if (!content) return;
		const parsed = JSON.parse(content);
		presentation.load(parsed);
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button variant="secondary" size="icon" class="w-[32px] h-[32px]" on:click={handleImport}>
			<UploadIcon class="w-3 h-3" />
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>Import</Tooltip.Content>
</Tooltip.Root>
