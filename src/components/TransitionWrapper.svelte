<script>
  import { fly } from "svelte/transition";

  export let centered = false;
</script>

<style lang="sass">
    div
      position: relative
      height: 100%

      &.centered
        display: flex
        justify-content: center
        align-items: center
        padding: 0 1rem
</style>

<div
  class:centered={centered}
  in:fly={{ x: 300, duration: 500, delay: 300 }}
  out:fly={{ x: -300, duration: 300 }}>
  <slot />
</div>
