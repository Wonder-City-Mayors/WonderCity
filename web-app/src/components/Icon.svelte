<script lang="ts">
    let d: string;

    export { d as icon };
</script>

<svg viewBox="0 0 24 24">
    <path {d} />
</svg>

<style lang="scss">
    @import "colors";

    svg {
        height: 1em;
        width: 1em;
        overflow: visible;

        path {
            fill: var(--icon-component-color, $color-primary);
        }
    }
</style>
