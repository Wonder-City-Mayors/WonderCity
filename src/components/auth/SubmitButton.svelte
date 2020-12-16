<script>
  import Button from "../Button.svelte";
  import { mdiLogin } from "@mdi/js";

  export let disabled;
  export let icon = mdiLogin;
  export let label = "Вход";
</script>

<Button {disabled} class="submit" variant="raised" {icon} {label} />
