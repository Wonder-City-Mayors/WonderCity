<script>
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";
  import Icon from "@smui/textfield/icon/index";

  export let value;
  export let error;
  export let icon;
  export let label;

  $: smuiError = error ? true : false;
  $: console.log(error);
</script>

<style lang="sass">
  @import "../theme/colors"

  .icon-wrapper
    --error: $color_error_red

  .error-label
    font-size: .75rem
    padding: .25rem .5rem
    color: $color_error_red
</style>

<Textfield
  style="
    width: 100%;
  "
  type="text"
  withLeadingIcon
  bind:value
  invalid={smuiError}
  {label}>
  <span class="icon-wrapper">
    <Icon
      style={error ? 'color: var(--error, red)' : ''}
      class="material-icons">
      {icon}
    </Icon>
  </span>
</Textfield>
{#if error}
  <p class="error-label">{error}</p>
{/if}
