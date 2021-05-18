<script lang="ts">
    import { slide } from "svelte/transition";

    export let type: string = "text";
    export let placeholder: string;
    export let value: string = "";
    export let error = false;
    export let interacted = false;

    export let validation: ((string) => string) | undefined;

    let stringError: string;

    function handleInput(e) {
        interacted = true;
        value = e.target.value;
    }

    $: {
        if (validation) {
            stringError = validation(value);
            error = interacted && Boolean(stringError);
        }
    }
</script>

<div class="input-container">
    <input class:error {value} {placeholder} {type} on:input={handleInput} />
    {#if error}
        <p class="input-container-error" transition:slide>
            {stringError}
        </p>
    {/if}
</div>

<style lang="scss">
    @import "colors";

    .input-container {
        margin: 0.25rem 0.5rem;

        &-error {
            font-size: 0.8rem;
            color: $color-error-red;
            padding: 0.25rem;
        }

        input {
            width: 100%;
            color: $color-primary;
            background-color: rgba($color-secondary, 0.25);
            padding: 0.25rem 0.5rem;
            border-radius: 0.3rem;
            transition: color 0.3s ease;
            font-family: defaultFont;
            font-size: 1rem;

            &::placeholder {
                color: rgba($color-primary, 0.75);
            }

            &.error {
                color: $color-error-red;
            }
        }
    }
</style>
