<script>
    import { extent } from "d3-array";
    import { scaleLinear, scaleTime } from "d3-scale";
    import { line, curveLinear } from "d3-shape";
    import { axisLeft, axisBottom } from "d3-axis";
    import { select } from "d3-selection";
    import { timeFormatDefaultLocale } from "d3-time-format";
    import { timeMillisecond } from "d3-time";

    // ----------------------------------------

    export let data;

    const ru = {
        decimal: ",",
        thousands: "\xa0",
        grouping: [3],
        currency: ["", " руб."],
        dateTime: "%A, %e %B %Y г. %X",
        date: "%d.%m.%Y",
        time: "%H:%M:%S",
        periods: ["AM", "PM"],
        days: [
            "воскресенье",
            "понедельник",
            "вторник",
            "среда",
            "четверг",
            "пятница",
            "суббота",
        ],
        shortDays: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
        months: [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
        ],
        shortMonths: [
            "Янв",
            "Фев",
            "Мар",
            "Апр",
            "Май",
            "Июн",
            "Июл",
            "Авг",
            "Сен",
            "Окт",
            "Ноя",
            "Дек",
        ],
    };

    // ----------------------------------------

    // Localization
    timeFormatDefaultLocale(ru);

    // Axes
    let leftAxis;
    let bottomAxis;

    // Line X parameters
    let extentX;
    let scaleX;

    // Line Y parameters
    let extentY;
    let scaleY;

    // Line itself
    let path;

    $: if (data) {
        extentX = extent(data, (d) => d.timestamp);
        scaleX = scaleTime().domain(extentX).range([40, 290]);
        extentY = extent(data, (d) => d.value);
        scaleY = scaleLinear().domain(extentY).range([180, 10]);
        path = line()
            .x((d) => scaleX(d.timestamp))
            .y((d) => scaleY(d.value))
            .curve(curveLinear);

        select(leftAxis).call(axisLeft(scaleY).ticks(8));
        select(bottomAxis).call(axisBottom(scaleX).ticks(5));
    }
</script>

{#if data}
    <svg viewBox="0 0 300 200">
        <g bind:this={leftAxis} transform="translate(40, 0)" />
        <g class="graph">
            <path d={path(data)} />
        </g>
        <g bind:this={bottomAxis} transform="translate(0, 180)" />
    </svg>
{/if}

<style lang="scss">
    @import "colors";

    .graph {
        stroke: $color-primary;
        fill: none;
    }
</style>
