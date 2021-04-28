<script context="module" lang="ts">
    import { getPreloadApiResponse } from "utils/requests";

    export async function preload(_page, session) {
        try {
            const response = await getPreloadApiResponse(
                session.apiUrl + "/device/count",
                {},
                this
            );

            return {
                count: response.count,
            };
        } catch (e) {
            if ("status" in e && e.status === 401) {
                await this.redirect(301, "/auth");
            }

            return {
                count: false,
            };
        }
    }
</script>

<script lang="ts">
    import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
    import Icon from "components/Icon.svelte";
    import Switchers from "components/Switchers.svelte";
    import Title from "components/Title.svelte";

    export let count: number | false;
    export let segment: string | undefined;

    $: current = segment ? parseInt(segment, 10) : 1;
</script>

<Title caption="Отслеживание показаний" />

{#if count > 0}
    <div class="wrapper">
        {#if current !== 1}
            <a class="switcher left" href="/monit/list/{current - 1}">
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
            <a class="switcher right" href="/monit/list/{current + 1}">
                <Icon icon={mdiChevronRight} />
            </a>
        {:else}
            <div class="filler right">
                <Icon icon={mdiChevronRight} />
            </div>
        {/if}

        <Switchers {count} {current} baseUrl="/monit/list" />
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
            .readouts
                padding: 0 3.5rem

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
                --icon-component-color: #{$color-secondary}

            .left
                left: 0

            .right
                right: 0
</style>
