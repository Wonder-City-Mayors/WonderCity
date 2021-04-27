<script context="module" lang="ts">
    import { getPreloadApiResponse } from "utils/requests";

    export async function preload(page, session) {
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
    import { stores } from "@sapper/app";
    import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
    import Icon from "components/Icon.svelte";
    import Switchers from "components/Switchers.svelte";
    import Title from "components/Title.svelte";
    import { onDestroy, setContext } from "svelte";
    import { readable } from "svelte/store";

    import type { Socket } from "socket.io-client";

    // -------------------------------------------------

    export let count: number | false;
    export let segment: string | undefined;

    // -------------------------------------------------

    let socket: Socket;
    const { session, page } = stores();

    const socketStore = readable<Socket | null>(null, (set) => {
        Promise.all([import("socket.io-client"), import("url-parse")]).then(
            ([socketio, url]) => {
                try {
                    const apiUrl = new url.default($session.apiUrl);

                    socket = socketio.io(apiUrl.origin, {
                        path:
                            apiUrl.pathname +
                            (apiUrl.pathname[apiUrl.pathname.length - 1] === "/"
                                ? ""
                                : "/") +
                            "socket.io/",
                    });
                } catch (e) {
                    socket = socketio.io($page.host, {
                        path: $session.apiUrl + "/socket.io/",
                    });
                }

                set(socket);
            }
        );

        return () => 0;
    });

    setContext("socket", socketStore);

    $: current = segment ? parseInt(segment, 10) : 1;

    onDestroy(() => {
        if ($socketStore) {
            $socketStore.disconnect();
        }
    });
</script>

<Title caption="Отслеживание показаний" />

{#if count > 0}
    <div class="wrapper">
        {#if current !== 1}
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
