<script context="module">
  import { getPreloadApiResponse } from "requests";

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
  import { onDestroy, onMount, setContext } from 'svelte';
  import { readable } from 'svelte/store';

  import TransitionWrapper from "TransitionWrapper.svelte";
  import Title from "Title.svelte";
  import Switchers from "Switchers.svelte";

  export let count;
  export let segment;

  let socket;

  $: current = parseInt(segment, 10);

  const socketStore = readable(null, set => {
    const interval = setInterval(() => {
      if (typeof io !== 'undefined') {
        clearInterval(interval);

        socket = io();

        set(socket);
      }
    });

    return () => 0;
  });

  setContext('socket', socketStore);

  onDestroy(() => {
    if ($socketStore) {
      $socketStore.disconnect();
    }
  });

  const switchPage = e => {
    goto(`/monit/${e.detail}`);
  };
</script>

<svelte:head>
  <script src="/socket.io/socket.io.min.js"></script>
</svelte:head>

<style lang="sass">
  @import "colors"

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
