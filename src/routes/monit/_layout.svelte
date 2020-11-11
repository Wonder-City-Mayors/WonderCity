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
  import { goto } from "@sapper/app";

  import TransitionWrapper from "TransitionWrapper.svelte";
  import Title from "Title.svelte";
  import Switchers from "Switchers.svelte";

  export let count;
  export let segment;

  $: current = parseInt(segment, 10);

  const switchPage = e => {
    goto(`/monit/${e.detail}`);
  };
</script>

<style lang="sass">
  @import "../../theme/colors"

  .no-devices
    color: $mdc-theme-secondary
    margin: .25rem .5rem
    text-align: center
</style>

<Title caption="Отслеживание показаний" />

{#if count > 0}
  <TransitionWrapper>
    <slot />
    <Switchers {count} {current} on:switch={switchPage} />
  </TransitionWrapper>
{:else}
  <h2 class="no-devices">
    К сожалению, у Вас нет зарегистрированных считывающих устройств.
  </h2>
{/if}
