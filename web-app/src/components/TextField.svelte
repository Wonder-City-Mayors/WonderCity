<script lang="ts">
    let placeholder: string;
    let value: string = "";

    export { placeholder, value };
</script>

<style lang="scss">
    @import "colors";
    input {
        &::placeholder {
            color: $color-primary;
        }

        background-color: rgb(255, 255, 255);
        border-radius: 50px;
        border-width: 3px;
        border-color: $color-primary;
        border-style: inset;
        padding: 8px;
        margin: 6px auto;
        display: block;
    }
</style>

<input {placeholder} bind:value />
