<script>
  import TransitionWrapper from "components/TransitionWrapper.svelte";
  import Title from "components/Title.svelte";
</script>

<Title caption="FAQ" />

<style lang="scss">
  @import "colors";

  h1 {
    color: $mdc-theme-primary;
    margin: .25em .5em;
  }
</style>

<TransitionWrapper>
  <h1>
    Здесь будет FAQ, а когда &mdash; решает Бог.
  </h1>
</TransitionWrapper>