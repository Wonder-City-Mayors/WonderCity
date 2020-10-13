<script context="module">
  import { getPreloadApiResponse } from "../../../utils/requests";

  export async function preload(page, session) {
    try {
      const count = await getPreloadApiResponse(
        `${session.apiUrl}/devices/countMine`,
        {},
        this
      );

      return {
        count,
      };
    } catch (e) {
      await this.redirect(301, "/auth");

      console.log(e);

      return {
        count: false,
      };
    }
  }
</script>

<script>
  import TransitionWrapper from "../../components/TransitionWrapper.svelte";

  export let count;
</script>

<style lang="sass">
  @import "../../theme/colors"

  .no-devices
    color: $mdc-theme-secondary
    margin: .25rem .5rem
    text-align: center
</style>

<svelte:head>
  <title>Отслеживание показаний • WonderCity Reborn</title>
</svelte:head>

{#if count > 0}
  <TransitionWrapper>
    <slot />
  </TransitionWrapper>
{:else}
  <h2 class="no-devices">
    К сожалению, у Вас нет зарегистрированных считывающих устройств.
  </h2>
{/if}
