<script>
  import { fly } from "svelte/transition";
  import { cubicIn } from "svelte/easing";
  import { onDestroy } from "svelte";

  export let centered = false;
  let it;

  const absoluteFly = (node, { duration = 300, x = 0, y = 0 }) => ({
    duration,
    css: (t) => {
      const eased = cubicIn(1 - t);

      return `
        transform: translate(${eased * x}px, ${eased * y}px);
        opacity: ${cubicIn(t)};
        position: absolute;
      `;
    },
  });
</script>

<style lang="sass">
    div
      position: relative
      width: 100%

      &.centered
        display: flex
        justify-content: center
        align-items: center
        padding: 0 1rem
</style>

<div
  class:centered
  bind:this={it}
  in:absoluteFly={{ x: 500, duration: 300 }}
  out:absoluteFly={{ x: -500, duration: 300 }}>
  <slot />
</div>
