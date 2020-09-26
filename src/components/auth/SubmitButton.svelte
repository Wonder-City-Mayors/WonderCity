<script>
  import Button, { Label, Icon } from "@smui/button";

  export let disabled;
  export let icon = "login";
  export let label = "Вход";
</script>

<Button {disabled} class="submit" variant="raised">
  <Icon class="material-icons" style="
    font-size: 1.1rem;
  ">{icon}</Icon>
  <Label>{label}</Label>
</Button>