<script>
  export let title;
  export let value;
</script>

<style lang="scss">
  @import "colors";

  .device-window {
    margin: .25em .5em;

    p {
      text-align: center;
      padding: .1em .4em;
    }

    &-title {
      background-color: var(--device-window-title-background-color, none);
      color: var(--device-window-title-color, $color-black);
      margin-bottom: .2em;
    }

    &-value {
      background-color: var(--device-window-value-background-color, white);
      color: var(--device-window-value-color, $color-black);
    }
  }
</style>

<div class="device-window">
  <p class="device-window-title">{title}</p>
  <p class="device-window-value">{value}</p>
</div>