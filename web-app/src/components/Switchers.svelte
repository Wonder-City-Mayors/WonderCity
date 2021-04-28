<script>
    import { arrayOf } from "utils/arrays";

    export let count;
    export let current;
    export let baseUrl;

    if (baseUrl[baseUrl.length - 1] !== "/") {
        baseUrl += "/";
    }

    const pageCount = parseInt(count / 10, 10) + (count % 10 ? 1 : 0);

    const min = (a, b) => (a > b ? b : a);
    const max = (a, b) => (a > b ? a : b);
</script>

<div class="switchers">
    {#if pageCount <= 9}
        {#each arrayOf(1, current) as page (page)}
            <a href="{baseUrl}{page}">
                <div class="switcher">{page}</div>
            </a>
        {/each}
        <div class="switcher current">{current}</div>
        {#each arrayOf(current + 1, pageCount + 1) as page (page)}
            <a href="{baseUrl}{page}">
                <div class="switcher">{page}</div>
            </a>
        {/each}
    {:else}
        {#if current !== 1}
            <a href="{baseUrl}1">
                <div class="switcher {current <= 4 ? '' : 'edge'}">1</div>
            </a>
        {/if}
        {#each arrayOf(max(2, min(pageCount - 7, current - 3)), current) as page (page)}
            <a href="{baseUrl}{page}">
                <div class="switcher">{page}</div>
            </a>
        {/each}
        <div class="switcher current">{current}</div>
        {#each arrayOf(current + 1, max(9, min(pageCount, current + 4))) as page (page)}
            <a href="{baseUrl}{page}">
                <div class="switcher">{page}</div>
            </a>
        {/each}
        {#if current !== pageCount}
            <a href="{baseUrl}{pageCount}">
                <div class="switcher {pageCount - current > 3 ? 'edge' : ''}">
                    {pageCount}
                </div>
            </a>
        {/if}
    {/if}
</div>

<style lang="scss">
    @import "colors";

    .switchers {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        a {
            text-decoration: none;
        }

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
