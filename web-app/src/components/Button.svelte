<script>
    import { createEventDispatcher } from "svelte";

    import Button, { Label } from "@smui/button";
    import Icon from "./Icon.svelte";

    let className, icon, label, disabled;
    export { className as class, icon, label, disabled };
    export let variant = "raised";
    export let color = "primary";

    const dispatch = createEventDispatcher();

    const dispatchClick = (e) => dispatch("click", e);
</script>

<Button
    class="button-component {className || ''}"
    {disabled}
    {color}
    {variant}
    on:click
>
    {#if icon}
        <Icon {icon} />
    {/if}
    {#if label}
        <Label class="button-component-label">{label}</Label>
    {/if}
</Button>

<style lang="sass">
    @import "colors"

    :global(.button-component)
        :global(.button-component-icon)
            font-size: 1.1rem

        :global(.button-component-label)
            color: var(--button-label-color, #{$color-surface})
            font-weight: 700
            font-family: defaultFont, sans-serif
</style>
