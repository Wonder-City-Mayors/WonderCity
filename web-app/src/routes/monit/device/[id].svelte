<script context="module" lang="ts">
    import { getPreloadApiResponse } from "utils/requests";

    export async function preload(page, session) {
        if (session.user.isAuthenticated) {
            if (
                await getPreloadApiResponse(
                    session.apiUrl + "/device/isMine",
                    {
                        deviceId: page.params.id,
                    },
                    this
                )
            )
                return {};
        }

        this.error(404, "Not found");
    }
</script>

<script lang="ts">
    import { getApiResponse } from "utils/requests";
    import Icon from "components/Icon.svelte";
    import Title from "components/Title.svelte";
    import Graph from "components/monit/Graph.svelte";
    import Button from "components/Button.svelte";
    import { stores } from "@sapper/app";
    import { onMount, getContext } from "svelte";

    import { mdiArrowLeft } from "@mdi/js";
    import type { Socket } from "socket.io-client";

    const { page, session } = stores();

    const socketStore = getContext<SvelteStore<Socket>>("socket");
    let promise: Promise<any>;
    let values: {
        value: number;
        timestamp: Date;
    }[];
    let difference = 30;
    let parts = 20;
    let msDifference = difference * 8.64e7;
    let previous = Date.now();

    function updateGraph() {
        const now = Date.now();
        msDifference = difference * 8.64e7;
        const partsCopy = parts;

        promise = getApiResponse(
            $session.apiUrl + "/value/stats",
            {
                begin: new Date(now - msDifference).toISOString(),
                deviceId: $page.params.id,
                parts: partsCopy,
            },
            true
        ).then(
            (array) =>
                (values = (function () {
                    const values = [];
                    const timestampDifference = msDifference / partsCopy;

                    for (let i = 1; i < array.length; i++) {
                        values.push({
                            value: array[i],
                            timestamp: new Date(
                                now - timestampDifference * (array.length - i)
                            ),
                        });
                    }

                    values.push({
                        value: 0,
                        timestamp: new Date(),
                    });

                    previous = Date.now();

                    return values;
                })())
        );
    }

    onMount(() => {
        updateGraph();

        setInterval(() => {
            const now = Date.now();

            if (now - previous >= msDifference) {
                previous = now;

                values.shift();
                values.push({
                    value: 0,
                    timestamp: new Date(),
                });
            }
        }, 1000);
    });

    $: {
        const socket = $socketStore;

        if (socket) {
            const id = parseInt($page.params.id, 10);

            socket.emit("newDevices", [id]);

            socket.on("newReadouts", (details) => {
                if (details.deviceId === id) {
                    values[values.length - 1].value += details.record;

                    values = values;
                }
            });
        }
    }
</script>

<Title caption="Датчик #{$page.params.id}" />

<section class="device-info">
    <header>
        <div class="icon" on:click={() => history.back()}>
            <Icon icon={mdiArrowLeft} />
        </div>
        <h1>
            <span class="hash">#</span>
            <span>{$page.params.id}</span>
        </h1>
    </header>

    <label>
        <input
            type="range"
            min="30"
            max="360"
            step="30"
            bind:value={difference}
        />
        <p>
            Отображать показания до {difference} дней назад
        </p>
    </label>

    <label>
        <input type="range" min="20" max="100" step="10" bind:value={parts} />
        <p>
            Разбивать график на {parts} частей
        </p>
    </label>

    <Button label="Отобразить" on:click={updateGraph} />

    {#await promise}
        Ждём...
    {:then _}
        <Graph data={values} />
    {:catch _}
        Да как так-то?
    {/await}
</section>

<style lang="sass">
    @import "colors"

    .device-info
        max-width: 36rem
        margin: 0 auto
        padding: .5rem
        color: $color-primary

    header
        display: flex
        justify-content: space-between
        color: $color-primary
        --icon-component-color: #{$color-secondary}

        .hash
            color: $color-secondary

        .icon
            font-size: 2rem

            &:hover
                cursor: pointer

    label
        display: block
        padding: .25rem
        margin: .5rem

        input
            width: 100%
            display: block

        p
            font-size: .8em
            text-align: right
</style>
