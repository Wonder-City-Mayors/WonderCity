<button on:click>
    <slot />
</button>

<style lang="scss">
     @import "colors";
    button {
        font-size: .75rem;
        display: block;
        margin: 6px auto;
        padding: .1rem;
        position: relative;
        background: rgb(255, 255, 255);
        color: $color-primary;
        text-decoration: none;
        text-transform: uppercase;
        border-radius: 5px;
        text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.5);
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
    }
</style>
