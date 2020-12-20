<script>
  import { extent } from "d3-array";
  import { scaleLinear, scaleTime } from "d3-scale";
  import { line, curveLinear } from "d3-shape";
  import { axisLeft, axisBottom } from "d3-axis";
  import { select } from "d3-selection";
  import { timeFormatDefaultLocale } from "d3-time-format";

  // ----------------------------------------

  export let data;
  export let locale;

  // ----------------------------------------

  // Localization
  timeFormatDefaultLocale(locale);

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

  $: {
    extentX = extent(data, (d) => d.timeStamp);
    scaleX = scaleTime().domain(extentX).range([50, 450]);
    extentY = extent(data, (d) => d.value);
    scaleY = scaleLinear().domain(extentY).range([450, 50]);
    path = line()
      .x((d) => scaleX(d.timeStamp))
      .y((d) => scaleY(d.value))
      .curve(curveLinear);

    select(leftAxis).call(axisLeft(scaleY).ticks(5));
    select(bottomAxis).call(
      axisBottom(scaleX).ticks(5)
    );
  }
</script>

<style lang="scss">
  @import "colors";

  .graph {
    stroke: $color-primary;
    fill: none;
  }
</style>

<svg viewBox="0 0 500 500">
  <g bind:this={leftAxis} transform="translate(50, 0)" />
  <g class="graph">
    <path d={path(data)} />
  </g>
  <g bind:this={bottomAxis} transform="translate(0, 450)" />
</svg>
