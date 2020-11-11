<script>
  export let caption;
  let title;

  if (caption) {
    title = `${caption} • ВундерВафля ре...борн? чё?`;
  } else {
    title = 'WonderCity';
  }
</script>

<svelte:head>
  <title>
    {title}
  </title>
</svelte:head>