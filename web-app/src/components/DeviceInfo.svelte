<script>
    export let device;
    export let format;

    // ----------------------------------

    const lastDate = device.date || new Date(NaN);

    $: if (device.active) {
        const time = device.date.getTime();

        if (time !== lastDate.getTime()) {
            lastDate.setTime(time);
        }
    }
</script>

{#if device.active}
    <a class="device active" href="/monit/device/{device.deviceId}">
        <h2>
            <span class="secondary"> # </span>
            {device.deviceId}
        </h2>
        <p>
            {device.record} мл
        </p>
        <p>
            {format(device.date, "ru")}
        </p>
    </a>
{:else}
    <div class="device unactive">
        <h2>
            <span class="secondary"> # </span>
            {device.deviceId}
        </h2>
        <p>Датчик неактивен</p>
    </div>
{/if}

<style lang="scss">
    @import "colors";

    .secondary {
        color: $color-secondary;
    }

    a {
        text-decoration: none;

        &,
        &:link,
        &:hover,
        &:focus,
        &:active {
            color: $color-primary;
        }
    }

    .device {
        flex: 1 10rem;
        max-width: 30rem;
        border: 0.15rem solid var(--main-color);
        color: var(--main-color);
        border-radius: 0.5rem;
        padding: 0.5rem;
        margin: 0.5rem;

        &:hover {
            cursor: pointer;
        }

        &.active {
            --main-color: #{$color-primary};
        }

        &.unactive {
            --main-color: #{$color-secondary};
        }
    }
</style>
