<script>
  import { stores } from "@sapper/app";
  
  import TransitionWrapper from "components/TransitionWrapper.svelte";
  import Title from "components/Title.svelte";

  const { session } = stores();
</script>

<style lang="sass">
  @import "../theme/colors"

  h1
    color: $mdc-theme-secondary
    text-align: center
</style>

<Title caption="Главная" />

<TransitionWrapper>
  {#if $session.user.isAuthenticated}
    <h1>Привет, {$session.user.first_name || $session.user.username}!</h1>
  {:else}
    <h1>Слава Богу, ты пришёл!</h1>
  {/if}
</TransitionWrapper>
