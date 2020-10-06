<script context="module">
  import { getPreloadApiResponse } from "../../../utils/requests";

  export async function preload(page, session) {
    try {
      const devices = await getPreloadApiResponse(
        `${session.apiUrl}/devices/getReadouts`,
        {
          page: page.query.page,
        },
        this
      );

      if (devices.length === 0 && page.query.page != 1) {
        await this.redirect(301, "/monit?page=1");
      }

      return {
        devices,
      };
    } catch (e) {
      console.log(e);
      this.redirect(301, "/auth");
    }
  }
</script>

<script>
  import TransitionWrapper from "../../components/TransitionWrapper.svelte";

  export let devices;
</script>

<svelte:head>
  <title>Отслеживание показаний • WonderCity Reborn</title>
</svelte:head>

<style lang="sass">
  @import "../../theme/colors"

  .no-devices
    color: $mdc-theme-secondary
    margin: .25rem .5rem
    text-align: center
</style>

<TransitionWrapper>
  <slot />
  {#if devices.length === 0}
    <h2 class="no-devices">
      К сожалению, у Вас нет зарегистрированных считывающих устройств.
    </h2>
  {:else}
    <h1>monitoring</h1>
  {/if}
</TransitionWrapper>
