<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
</script>

<style lang="sass">
    div
      position: relative
</style>

<div
  in:fly={{ x: 300, duration: 500, delay: 300 }}
  out:fly={{ x: -300, duration: 300 }}>
  <slot />
</div>
