<script>
  import { slide } from "svelte/transition";

  import { mdiChevronDown } from "@mdi/js";

  import Icon from "Icon.svelte";
  import Window from "monit/Window.svelte";

  import { shiftForward } from "arrays";

  // ----------------------------------

  export let device;
  export let format;

  // ----------------------------------

  let opened = false;
  let dayStats = null;
  let monthStats = null;
  let yearStats = null;
  let chosenStats = 'day';

  const lastDate = new Date();

  const handleClick = () => {
    if (device.active) {
      if (opened) {
        opened = false;
      } else {
        opened = true;
      }
    }
  };

  const updateStats = () => {
    if (dayStats) {
      if (newDate.getHours() !== lastDate.getHours()) {
        shiftForward(dayStats, 0);
      } else {
        dayStats[0] += device.lastRecord;
      }
    }

    if (monthStats) {
      if (newDate.getDate() !== lastDate.getDate()) {
        shiftForward(monthStats, 0);
      } else {
        monthStats[0] += device.lastRecord;
      }
    }

    if (yearStats) {
      if (newDate.getMonth() !== lastDate.getMonth()) {
        shiftForward(yearStats, 0);
      } else {
        yearStats[0] += device.lastRecord;
      }
    }
  };

  $: {
    const newDate = new Date();

    if (device.lastRecord) {
      updateStats();
    }

    lastDate.setTime(newDate.getTime());
  }
</script>

<style lang="scss">
  @import "colors";

  .device-container {
    margin: 1rem;

    .device {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border-width: 0.2rem;
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
        border-color: rgba($color-primary, 0.2);
        background-color: rgba($color-primary, 0.1);
        transition: transform 0.3s ease;

        &:hover {
          cursor: pointer;
        }
      }

      &.unactive {
        border-color: rgba($color-secondary, 0.2);
        background-color: rgba($color-secondary, 0.1);
      }

      .divider {
        flex-grow: 1;
        flex-basis: 0;
      }

      &-unactive {
        color: $color-secondary;
      }

      .icon {
        transition: transform 0.3s ease;
        transform-origin: center center;
      }
    }

    .statistics {
      width: 80%;
      margin: auto;
      padding: 0.25em 0.5em;
    }
  }
</style>

<div class="device-container">
  <div
    class:opened
    class="device {device.active ? 'active' : 'unactive'}"
    on:click={handleClick}>
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
      <h3 class="device-unactive">Девайс неактивен</h3>
    {/if}
  </div>

  {#if opened}
    <div class="statistics" transition:slide>
      <label>
        <input type="radio" bind:group={chosenStats} value="day" />
        День (24 часа)
      </label>

      <label>
        <input type="radio" bind:group={chosenStats} value="month" />
        30 дней
      </label>

      <label>
        <input type="radio" bind:group={chosenStats} value="year" />
        Год (12 месяцев)
      </label>
    </div>
  {/if}
</div>
