<script>
  export let caption;
  let title;

  if (caption) {
    title = `${caption} • Wonder City`;
  } else {
    title = 'Wonder City';
  }
</script>

<svelte:head>
  <title>
    {title}
  </title>
</svelte:head>