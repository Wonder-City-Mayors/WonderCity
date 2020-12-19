<script>
  import { extent } from 'd3-array';
  import { scaleLinear, scaleTime } from 'd3-scale';
  import { line, curveBasis } from 'd3-shape';

  // ----------------------------------------

  export let data;

  // ----------------------------------------

  let extentX = extent(data, d => d.timeStamp);
  let scaleX = scaleTime()
    .domain(extentX)
    .range([10, 90]);

  let extentY = extent(data, d => d.value);
  let scaleY = scaleLinear()
    .domain(extentY)
    .range([90, 10]);

  let path = line()
    .x(d => scaleX(d.timeStamp))
    .y(d => scaleY(d.value))
    .curve(curveBasis);
</script>

<svg viewBox="0 0 100 100">
  <g>
    <path
      d={path(data)}
      fill="none"
      stroke="blue"
    />
  </g>
</svg>