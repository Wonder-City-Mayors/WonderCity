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
  const singleDatesArray = [
    'только что',
    'минуту',
    'час',
    'день',
    'неделю',
    'месяц',
    'год'
  ];
  const multipleDatesArray = [
    ['секунду', 'секунды', 'секунд'],
    ['минуту', 'минуты', 'минут'],
    ['час', 'часа', 'часов'],
    ['день', 'дня', 'дней'],
    ['неделю', 'недели', 'недель'],
    ['месяц', 'месяца', 'месяцев'],
    ['год', 'года', 'лет']
  ];
  const ruLocale = (number, index, totalSec) => {
    totalSec = parseInt(totalSec, 10);
    const resultIndex = parseInt(index / 2, 10);

    if (index % 2 === 0) {
      if (index === 0) {
        return ['только что', 'сейчас'];
      } else {
        return [
          `${singleDatesArray[resultIndex]} назад`,
          `через ${singleDatesArray[resultIndex]}`
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
        `через %s ${multipleDatesArray[resultIndex][numberIndex]}`
      ];
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

            console.log(device.date);

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
          parseInt(device.time_stamp_db.substring(5, 7), 10) - 1,
          parseInt(device.time_stamp_db.substring(8, 10), 10),
          parseInt(device.time_stamp_db.substring(11, 13), 10),
          parseInt(device.time_stamp_db.substring(14, 16), 10),
          parseInt(device.time_stamp_db.substring(17, 19), 10),
          parseInt(device.time_stamp_db.substring(20, 23), 10)
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
