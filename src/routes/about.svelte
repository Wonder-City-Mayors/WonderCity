<script>
  import TransitionWrapper from "TransitionWrapper.svelte";
  import Title from "Title.svelte";
</script>

<Title caption="О SQBit" />

<style lang="sass">
  @import "global.scss"

  h1
    color: $mdc-theme-primary
    margin: .25em .5em
</style>

<TransitionWrapper>
  <h1>
    Всем хай, велкоме, добрый вечер: я диспетчер.
  </h1>
</TransitionWrapper>