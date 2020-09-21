<script>
  import { stores } from "@sapper/app";

  const { session } = stores();
</script>

<style lang="scss">
  h1 {
    color: #aaa;
    text-align: center;
  }
</style>

<h1>Привет, {$session.user.username || "неизвестный пользователь!"}!</h1>
