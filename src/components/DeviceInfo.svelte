<script>
  export let device;
  export let format;
  
</script>

<style lang="scss">
  @import "colors";

  .device {
    display: flex;
    align-items: center;
    padding: .5rem;
    margin: 1rem;
    border-width: .2rem;
    border-style: solid;

    &.active {
      border-color: rgba($color-primary, .2);
      background-color: rgba($color-primary, .1);

      &:hover {
        transform: scale(1.05);
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
  }
</style>

<div class="device {device.active ? 'active' : 'unactive'}">
  {#if device.active}
    <div class="device-window">

    </div>
    <div class="divider" />
    <div class="device-window">

    </div>
  {:else}
    <div class="device-window">

    </div>
    <div class="divider" />
    <h3 class="device-unactive">
      Девайс неактивен  
    </h3>
  {/if}
  <!-- Девайс с идентификатором
  {#if device.active}
    <h3>{device.id}</h3>
    получил показания
    <h2>{device.lastRecord} (в целом {device.sum})</h2>
    {format(device.date, 'ru')}.
  {:else}{device.id} ещё ни разу не получал показаний.{/if} -->
</div>