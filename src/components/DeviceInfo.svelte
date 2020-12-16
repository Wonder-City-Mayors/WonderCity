<script>
  import { slide } from 'svelte/transition';

  import { mdiChevronDown } from '@mdi/js';

  import Icon from "Icon.svelte";
  import Window from "monit/Window.svelte";

  // ----------------------------------

  export let device;
  export let format;

  // ----------------------------------

  let opened = false;

  const handleClick = () => {
    if (device.active) {
      opened = !opened;
    }
  };
</script>

<style lang="scss">
  @import "colors";

  .device-container {
    margin: 1rem;

    .device {
      display: flex;
      align-items: center;
      padding: .5rem;
      border-width: .2rem;
      border-style: solid;

      &.opened {
        &:hover {
          transform: scale(0.975);
        }

        .icon {
          transform: rotate(180deg);
        }
      }

      &:not(.opened):hover {
        transform: scale(1.025);
      }

      &.active {
        border-color: rgba($color-primary, .2);
        background-color: rgba($color-primary, .1);
        transition: transform .3s ease;

        &:hover {
          cursor: pointer;
        }
      }

      &.unactive {
        border-color: rgba($color-secondary, .2);
        background-color: rgba($color-secondary, .1);
      }

      .divider {
        flex-grow: 1;
        flex-basis: 0;
      }

      &-unactive {
        color: $color-secondary;
      }

      .icon {
        transition: transform .3s ease;
        transform-origin: center center;
      }
    }

    .statistics {
      width: 80%;
      margin: auto;
      padding: .25em .5em;
    }
  }
</style>

<div class="device-container">
  <div
    class:opened
    class="device {device.active ? 'active' : 'unactive'}"
    on:click={handleClick}
  >
    <Window title="Идентификатор" value={device.id} />
    {#if device.active}
      <div class="divider" />
      <Window title="Показания" value={device.lastRecord} />
      <div class="divider" />
      <Window title="Время" value={format(device.date, 'ru')} />
      <div class="icon">
        <Icon icon={mdiChevronDown} />
      </div>
    {:else}
      <div class="divider" />
      <h3 class="device-unactive">
        Девайс неактивен  
      </h3>
    {/if}
  </div>

  {#if opened}
    <div class="statistics" transition:slide>
      Сумма: {device.sum}
    </div>
  {/if}
</div>