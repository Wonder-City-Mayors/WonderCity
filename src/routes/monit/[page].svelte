<script context="module">
  import { getPreloadApiResponse } from "requests";

  export async function preload(page, session) {
    const devices = await getPreloadApiResponse(
      `${session.apiUrl}/devices/getReadouts`,
      {
        page: page.params.page,
      },
      this
    );

    return {
      devices,
    };
  }
</script>

<script>
  import { getContext } from "svelte";
  import { format, register } from "timeago.js";

  export let devices;

  let socket;
  const socketStore = getContext("socket");
  const ruLocale = (number, index, totalSec) => {
    totalSec = parseInt(totalSec, 10);

    switch (index) {
      case 0:
        return ["только что", "сейчас"];

      case 1:
        if (totalSec > 10 && totalSec < 20) {
          return ["%s секунд назад", "через %s секунд"];
        } else {
          const remainder = totalSec % 10;

          if (remainder === 1) {
            return ["%s секунду назад", "через %s секунду"];
          } else if (remainder > 1 && remainder < 5) {
            return ["%s секунды назад", "через %s секунды"];
          } else {
            return ["%s секунд назад", "через %s секунд"];
          }
        }

      case 2:
        return ['минуту назад', 'через минуту'];

      case 3:
        const totalMin = totalSec / 60;

        if (totalMin > 10 && totalMin < 20) {
          return ["%s минут назад", "через %s минут"];
        } else {
          const remainder = totalMin % 10;

          if (remainder === 1) {
            return ["%s минуту назад", "через %s минуту"];
          } else if (remainder > 1 && remainder < 5) {
            return ["%s минуты назад", "через %s минуты"];
          } else {
            return ["%s минут назад", "через %s минут"];
          }
        }
      
      default:
        return ['%s назад', 'через %s'];
    }
  };

  register("ru", ruLocale);

  socketStore.subscribe((freshSocket) => {
    if (freshSocket) {
      socket = freshSocket;

      socket.on("newReadouts", (details) => {
        for (const device of devices) {
          if (device.id === details.deviceId) {
            device.power = details.value;
            device.date = new Date();
            device.active = true;

            break;
          }
        }
      });
    }
  });

  $: {
    const devicesIds = [];

    devices.map((device) => {
      devicesIds.push(device.id);
      device.active = device.hasOwnProperty("power");

      if (!device.hasOwnProperty("date") && device.active) {
        device.date = new Date(
          parseInt(device.time_stamp_db.substring(0, 4), 10),
          parseInt(device.time_stamp_db.substring(5, 7), 10),
          parseInt(device.time_stamp_db.substring(8, 10), 10),
          parseInt(device.time_stamp_db.substring(11, 13), 10),
          parseInt(device.time_stamp_db.substring(14, 16), 10),
          parseInt(device.time_stamp_db.substring(17, 19), 10),
          parseInt(device.time_stamp_db.substring(20, 23), 10)
        );
      }
    });

    if (socket) {
      socket.emit("newDevices", devicesIds);
    }
  }

  setInterval(() => {
    devices = devices;
  }, 1000);
</script>

<style lang="scss">
  @import "colors";

  p {
    margin: 0.4rem 0.5rem;
    text-align: center;

    &.active {
      color: $mdc-theme-primary;
    }

    &.unactive {
      color: $mdc-theme-secondary;
    }

    h2,
    h3 {
      display: inline;
    }
  }
</style>

{#each devices as device (device.id)}
  <p class={device.active ? 'active' : 'unactive'}>
    Девайс с идентификатором
    {#if device.active}
      <h3>{device.id}</h3>
      получил показания
      <h2>{device.power}</h2>
      {format(device.date, 'ru')}.
    {:else}{device.id} ещё ни разу не получал показаний.{/if}
  </p>
{/each}
