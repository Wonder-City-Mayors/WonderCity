<script>
  import { createEventDispatcher } from "svelte";

  import { arrayOf } from "arrays";

  export let count;
  export let current;

  const dispatch = createEventDispatcher();
  const pageCount = parseInt(count / 10, 10) + (count % 10 ? 1 : 0);

  const min = (a, b) => (a > b ? b : a);
  const max = (a, b) => (a > b ? a : b);
</script>

<style lang="scss">
  @import "colors";

  .switchers {
    display: flex;
    justify-content: center;

    .switcher {
      padding: 0.3rem 1rem;
      margin: 0 0.5rem;
      text-align: center;
      border-bottom: 0.1rem solid rgba($mdc-theme-primary, 0.75);
      color: rgba($mdc-theme-primary, 0.75);
      transition: background-color 0.3s ease, color 0.3s ease;

      &:not(.current):hover {
        background-color: rgba($mdc-theme-primary, 0.75);
        color: white;
        cursor: pointer;
      }

      &.current {
        border-bottom: 0.1rem solid $mdc-theme-secondary;
        color: $mdc-theme-secondary;
      }

      &.edge {
        border-bottom: 0.1rem solid $mdc-theme-primary;
        color: $mdc-theme-primary;

        &:first-child {
          margin: 0 2rem 0 0;
        }

        &:last-child {
          margin: 0 0 0 2rem;
        }

        &:hover {
          background-color: $mdc-theme-primary;
          color: white;
          cursor: pointer;
        }
      }
    }
  }
</style>

<div class="switchers">
  {#if pageCount <= 9}
    {#each arrayOf(1, current) as page (page)}
      <div on:click={() => dispatch('switch', page)} class="switcher">
        {page}
      </div>
    {/each}
    <div class="switcher current">{current}</div>
    {#each arrayOf(current + 1, pageCount + 1) as page (page)}
      <div on:click={() => dispatch('switch', page)} class="switcher">
        {page}
      </div>
    {/each}
  {:else}
    {#if current !== 1}
      <div
        on:click={() => dispatch('switch', 1)}
        class="switcher {current <= 4 ? '' : 'edge'}">
        1
      </div>
    {/if}
    {#each arrayOf(max(2, min(pageCount - 7, current - 3)), current) as page (page)}
      <div on:click={() => dispatch('switch', page)} class="switcher">
        {page}
      </div>
    {/each}
    <div class="switcher current">{current}</div>
    {#each arrayOf(current + 1, max(9, min(pageCount, current + 4))) as page (page)}
      <div on:click={() => dispatch('switch', page)} class="switcher">
        {page}
      </div>
    {/each}
    {#if current !== pageCount}
      <div
        on:click={() => dispatch('switch', pageCount)}
        class="switcher {pageCount - current > 3 ? 'edge' : ''}">
        {pageCount}
      </div>
    {/if}
  {/if}
</div>
