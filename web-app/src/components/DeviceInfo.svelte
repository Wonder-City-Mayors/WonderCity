<script>
    import { slide } from "svelte/transition";
    import { stores } from "@sapper/app";
    import { parse } from "date-and-time";

    import { mdiChevronDown } from "@mdi/js";

    import Icon from "./Icon.svelte";
    import Window from "./monit/Window.svelte";
    import Graph from "./monit/Graph.svelte";

    import { shiftForward } from "utils/arrays";
    import { getApiResponse } from "utils/requests";

    // ----------------------------------

    export let device;
    export let format;
    export let locale;

    // ----------------------------------

    let opened = false;
    let chosenStat = "Day";

    const stats = {};
    const { session } = stores();
    const lastDate = device.date || new Date(NaN);

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
        if ("Day" in stats) {
            if (device.date.getHours() !== lastDate.getHours()) {
                shiftForward(stats.Day, {
                    value: 0,
                    timeStamp: device.date,
                });
            } else {
                stats.Day[0].value += device.lastRecord;
            }
        }

        if ("Month" in stats) {
            if (device.date.getDate() !== lastDate.getDate()) {
                shiftForward(stats.Month, {
                    value: 0,
                    timeStamp: device.date,
                });
            } else {
                stats.Month[0].value += device.lastRecord;
            }
        }

        if ("Year" in stats) {
            if (device.date.getMonth() !== lastDate.getMonth()) {
                shiftForward(stats.Year, {
                    value: 0,
                    timeStamp: device.date,
                });
            } else {
                stats.Year[0].value += device.lastRecord;
            }
        }

        if ("Prediction" in stats) {
            if (device.date.getDate() !== lastDate.getDate()) {
                shiftForward(stats.Prediction, {
                    value: 0,
                    timeStamp: device.date,
                });
            } else {
                stats.Prediction[0].value += device.lastRecord;
            }
        }
    };

    const checkStats = () => {
        stats[chosenStat] = getApiResponse(
            `${$session.apiUrl}/value/stat${chosenStat}`,
            {
                deviceId: device.deviceId,
                timezoneOffset: device.date.getTimezoneOffset(),
            },
            true
        ).then((data) => {
            const resp = data.response;

            for (const stat of resp) {
                stat.timeStamp = parse(
                    stat.timeStamp,
                    "YYYY MM DD HH mm ss     "
                );
            }

            stats[chosenStat] = resp;
        });
    };

    $: if (device.active) {
        const time = device.date.getTime();

        if (time !== lastDate.getTime()) {
            updateStats();

            lastDate.setTime(time);
        }
    }

    $: if (opened && !stats.hasOwnProperty(chosenStat)) {
        checkStats();
    }
</script>

<div class="device-container">
    <div
        class:opened
        class="device {device.active ? 'active' : 'unactive'}"
        on:click={handleClick}
    >
        <Window title="Идентификатор" value={device.deviceId} />
        {#if device.active}
            <Window title="Показания" value={device.record} />
            <Window title="Время" value={format(device.date, "ru")} />
            <div class="icon">
                <Icon icon={mdiChevronDown} />
            </div>
        {:else}
            <h3 class="device-unactive">Девайс неактивен</h3>
        {/if}
    </div>

    {#if opened}
        <div class="statistics" transition:slide>
            <label>
                <input type="radio" bind:group={chosenStat} value="Day" />
                День (24 часа)
            </label>

            <label>
                <input type="radio" bind:group={chosenStat} value="Month" />
                30 дней
            </label>

            <label>
                <input type="radio" bind:group={chosenStat} value="Year" />
                Год (12 месяцев)
            </label>
            <label>
                <input
                    type="radio"
                    bind:group={chosenStat}
                    value="Prediction"
                />
                ГОРОскоп (1 месяц)
            </label>

            <div class="statistics-content">
                {#await stats[chosenStat]}
                    Загрузка...
                {:then stat}
                    <Graph data={stats[chosenStat]} {locale} />
                {:catch error}
                    Ошибка.
                {/await}
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    @import "colors";

    .device-container {
        margin: 1rem;

        .device {
            display: flex;
            align-items: center;
            justify-content: space-between;
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

            &.active {
                border-color: rgba($color-primary, 0.2);
                background-color: rgba($color-primary, 0.1);
                transition: transform 0.3s ease;

                &:not(.opened):hover {
                    transform: scale(1.025);
                }

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
