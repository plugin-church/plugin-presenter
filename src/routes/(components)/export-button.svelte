<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { DownloadIcon } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { download } from '$lib/utils';
	import { presentation } from '$lib/presentation';

	function handleDownload() {
		download(
			`${$presentation.name.toLowerCase().replaceAll(' ', '_')}-${Date.now()}.plgnpres`,
			`data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify($presentation))}`
		);
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button variant="secondary" size="icon" class="w-[32px] h-[32px]" on:click={handleDownload}>
			<DownloadIcon class="w-3 h-3" />
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>Export</Tooltip.Content>
</Tooltip.Root>
