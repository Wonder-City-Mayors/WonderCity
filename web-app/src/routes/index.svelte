<script>
    import { stores } from "@sapper/app";

    import Title from "components/Title.svelte";

    const { session } = stores();
</script>

<Title caption="Главная" />

{#if $session.user.isAuthenticated}
    <h1>Привет, {$session.user.firstName || $session.user.username}!</h1>
{:else}
    <h1>Слава Богу, ты пришёл!</h1>
{/if}

<style lang="sass">
  @import "colors"

  h1
    color: $mdc-theme-secondary
    text-align: center
</style>
