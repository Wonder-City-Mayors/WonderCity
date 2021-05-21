<script context="module">
    import { getPreloadApiResponse } from "utils/requests";

    export async function preload(page, session) {
        const devices = await getPreloadApiResponse(
            session.apiUrl + `/device/getReadouts`,
            {
                page: page.params.page,
            },
            this
        );

        console.log(devices);

        return {
            devices,
        };
    }
</script>

<script>
    import { getContext } from "svelte";
    import { format, register } from "timeago.js";
    import Device from "components/DeviceInfo.svelte";

    export let devices = [];

    let socket;
    let mutableDevices = devices;
    const socketStore = getContext("socket");
    const singleDatesArray = [
        "только что",
        "минуту",
        "час",
        "день",
        "неделю",
        "месяц",
        "год",
    ];
    const multipleDatesArray = [
        ["секунду", "секунды", "секунд"],
        ["минуту", "минуты", "минут"],
        ["час", "часа", "часов"],
        ["день", "дня", "дней"],
        ["неделю", "недели", "недель"],
        ["месяц", "месяца", "месяцев"],
        ["год", "года", "лет"],
    ];
    const ruLocale = (number, index, totalSec) => {
        totalSec = parseInt(totalSec, 10);
        const resultIndex = parseInt(index / 2, 10);

        if (index % 2 === 0) {
            if (index === 0) {
                return ["только что", "сейчас"];
            } else {
                return [
                    `${singleDatesArray[resultIndex]} назад`,
                    `через ${singleDatesArray[resultIndex]}`,
                ];
            }
        } else {
            let numberIndex;

            if (number > 10 && number < 20) {
                numberIndex = 2;
            } else {
                const remainder = number % 10;

                if (remainder === 1) {
                    numberIndex = 0;
                } else if (remainder > 1 && remainder < 5) {
                    numberIndex = 1;
                } else {
                    numberIndex = 2;
                }
            }

            return [
                `%s ${multipleDatesArray[resultIndex][numberIndex]} назад`,
                `через %s ${multipleDatesArray[resultIndex][numberIndex]}`,
            ];
        }
    };

    register("ru", ruLocale);

    socketStore.subscribe((freshSocket) => {
        if (freshSocket) {
            socket = freshSocket;

            socket.on("newReadouts", (details) => {
                for (const device of devices) {
                    if (device.deviceId === details.deviceId) {
                        device.record = details.record;
                        device.date = new Date();
                        device.active = true;

                        return;
                    }
                }
            });
        }
    });

    $: {
        const devicesIds = [];

        devices.forEach((device) => {
            devicesIds.push(device.deviceId);

            device.active = "record" in device;

            if (!("date" in device) && device.active) {
                device.date = new Date(
                    parseInt(device.timestamp.substring(0, 4), 10),
                    parseInt(device.timestamp.substring(5, 7), 10) - 1,
                    parseInt(device.timestamp.substring(8, 10), 10),
                    parseInt(device.timestamp.substring(11, 13), 10),
                    parseInt(device.timestamp.substring(14, 16), 10),
                    parseInt(device.timestamp.substring(17, 19), 10),
                    parseInt(device.timestamp.substring(20, 23), 10)
                );

                device.date.setTime(
                    device.date.getTime() -
                        device.date.getTimezoneOffset() * 60000
                );
            }
        });

        if (socket) {
            socket.emit("newDevices", devicesIds);
        }
    }

    setInterval(() => (mutableDevices = devices), 1000);
</script>

{#if devices.length > 0}
    <div class="devices">
        {#each mutableDevices as device (device.deviceId)}
            <Device {device} {format} />
        {/each}
    </div>
{:else}Произошла какая-то досадная оплошность. Агась.{/if}

<style lang="scss">
    .devices {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
</style>
