<script>
  export let caption;
  let title;

  if (caption) {
    title = `${caption} • Wunderwaffel`;
  } else {
    title = 'Wunderwaffel';
  }
</script>

<svelte:head>
  <title>
    {title}
  </title>
</svelte:head>