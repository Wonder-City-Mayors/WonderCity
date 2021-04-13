<script context="module" lang="ts">
    import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
    import Icon from "components/Icon.svelte";
    import Switchers from "components/Switchers.svelte";
    import Title from "components/Title.svelte";
    import { onDestroy, setContext } from "svelte";
    import { readable } from "svelte/store";
    import { getPreloadApiResponse } from "utils/requests";

    export async function preload(page, session) {
        try {
            const count = await getPreloadApiResponse(
                session.apiUrl + "/device/count",
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

<script lang="ts">
    import { io } from "socket.io-client";

    // -------------------------------------------------

    export let count;
    export let segment;

    // -------------------------------------------------

    let socket;

    const socketStore = readable(null, (set) => {
        const interval = setInterval(() => {
            if (typeof io !== "undefined") {
                clearInterval(interval);

                socket = io();

                set(socket);
            }
        });

        return () => 0;
    });

    setContext("socket", socketStore);

    $: current = parseInt(segment, 10);

    onDestroy(() => {
        if ($socketStore) {
            $socketStore.disconnect();
        }
    });
</script>

<Title caption="Отслеживание показаний" />

{#if count > 0}
    <div class="wrapper">
        {#if segment !== "1"}
            <a class="switcher left" href="/monit/{current - 1}">
                <Icon icon={mdiChevronLeft} />
            </a>
        {:else}
            <div class="filler left">
                <Icon icon={mdiChevronLeft} />
            </div>
        {/if}
        <div class="readouts">
            <slot />
        </div>
        {#if count > current * 10}
            <a class="switcher right" href="/monit/{current + 1}">
                <Icon icon={mdiChevronRight} />
            </a>
        {:else}
            <div class="filler right">
                <Icon icon={mdiChevronRight} />
            </div>
        {/if}

        <Switchers {count} {current} baseUrl="/monit" />
    </div>
{:else}
    <h2 class="no-devices">
        К сожалению, у Вас нет зарегистрированных считывающих устройств.
    </h2>
{/if}

<style lang="sass">
  @import "colors"

  .wrapper
    padding-bottom: .5rem

    .switcher,
    .filler
      display: none

  .no-devices
    color: $mdc-theme-secondary
    margin: .25rem .5rem
    text-align: center

  @media (min-aspect-ratio: 23/18)
    .wrapper
      .switcher,
      .filler
        position: fixed
        top: 0
        display: block
        height: 100vh
        font-size: 2.5rem
        display: flex
        justify-content: center
        align-items: center

      .switcher
        padding: 0 .5rem
        opacity: .4
        transition: opacity .3s ease, background-color .3s ease

        &:hover
          opacity: 1
          background-color: rgba($color-primary, .25)

      .filler
        --icon-component-color: #aaa

      .left
        left: 0

      .right
        right: 0

      .readouts
        max-width: 36rem
        margin: 0 auto
</style>
