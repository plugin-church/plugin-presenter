<script>
	export let ordered;
	export let start;
</script>

{#if ordered}
	<ol class="list-decimal" {start}><slot></slot></ol>
{:else}
	<ul class="list-disc"><slot></slot></ul>
{/if}
