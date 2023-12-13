<script>
	import { base } from '$app/paths';

	import '../app.pcss';
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>Plugin Presenter — Easy Worship Slides</title>
	<meta name="title" content="Plugin Presenter — Easy Worship Slides" />
	<meta
		name="description"
		content="A small web based presentation app (like Power Point, Pro Presenter, or Proclaim) specifically made for song lyrics!"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={base} />
	<meta property="og:title" content="Plugin Presenter — Easy Worship Slides" />
	<meta
		property="og:description"
		content="A small web based presentation app (like Power Point, Pro Presenter, or Proclaim) specifically made for song lyrics!"
	/>
	<!-- <meta property="og:image" content="https://metatags.io/images/meta-tags.png" /> -->

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={base} />
	<meta property="twitter:title" content="Plugin Presenter — Easy Worship Slides" />
	<meta
		property="twitter:description"
		content="A small web based presentation app (like Power Point, Pro Presenter, or Proclaim) specifically made for song lyrics!"
	/>
	<!-- <meta property="twitter:image" content="https://metatags.io/images/meta-tags.png" /> -->

	<!-- Meta Tags Generated with https://metatags.io -->
</svelte:head>

<slot />
