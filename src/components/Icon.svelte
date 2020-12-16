<script>
  let d;

  export { d as icon };
</script>

<style lang="scss">
  @import "colors";

  svg {
    height: 1em;
    width: 1em;
    overflow: visible;

    path {

      fill: var(--icon-component-color, $color-primary);
    }
  }
</style>

<svg viewBox="0 0 20 20">
  <path {d} />
</svg>