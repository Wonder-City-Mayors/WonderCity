<script>
  import { fly } from "svelte/transition";
  import Textfield from "../Textfield.svelte";

  export let element;
</script>

<style lang="scss">
  @import "../../theme/global";

  h3 {
    text-align: center;
  }

  form {
    display: flex;
    flex-wrap: wrap;
    color: $mdc-theme-secondary;
  }
</style>

<form
  bind:this={element}
  class="signup"
  transition:fly={{ x: 300, duration: 300 }}>
  <h3>Not yet implemented, sorry.</h3>
</form>
