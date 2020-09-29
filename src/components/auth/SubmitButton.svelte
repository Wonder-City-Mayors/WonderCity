<script>
  import Button from "../Button.svelte";

  export let disabled;
  export let icon = "login";
  export let label = "Вход";
</script>

<Button {disabled} class="submit" variant="raised" {icon} {label} />
