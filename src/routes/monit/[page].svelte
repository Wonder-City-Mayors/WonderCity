<script context="module">
  import { getPreloadApiResponse } from "../../../utils/requests";

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
  import { format, register } from 'timeago.js';

  export let devices;

  const ruLocale = (number, index, totalSec) => ([
    ['только что', 'сейчас'],
    ['%s секунд назад', 'через %s секунд'],
    ['минуту назад', 'через минуту'],
    ['%s минут назад', 'через %s минут'],
    ['час назад', 'через час'],
    ['%s часов назад', 'через %s часов'],
    ['день назад', 'через день'],
    ['%s дней назад', 'через %s дней'],
    ['неделю назад', 'через неделю'],
    ['%s недели назад', 'через %s недели'],
    ['месяц назад', 'через месяц'],
    ['%s месяцев назад', 'через %s месяцев'],
    ['год назад', 'через год'],
    ['%s лет назад', 'через %s лет'],
  ][index]);

  register('ru', ruLocale);

  $: devices.map((device) => {
    device.active = device.hasOwnProperty("power");

    if (device.active) {
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

    h2, h3 {
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
