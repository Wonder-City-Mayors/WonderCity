<script>
  import { stores } from "@sapper/app";
  import TransitionWrapper from "../components/TransitionWrapper.svelte";

  const { session } = stores();
</script>

<style lang="scss">
  h1 {
    color: #aaa;
    text-align: center;
  }
</style>

<svelte:head>
  <title>Главная • WonderCity Reborn</title>
</svelte:head>

<TransitionWrapper>
  <h1>Привет, {$session.user.username || "неизвестный пользователь"}!</h1>
</TransitionWrapper>
