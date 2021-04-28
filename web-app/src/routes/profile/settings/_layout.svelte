<script context="module">
    export async function preload(_page, session) {
        if (session.user.isAuthenticated) {
            return {};
        }

        this.redirect(301, "/");
    }
</script>

<script>
    export let segment;
</script>

<div class="controls">
    <a href="/profile/settings/devices" class:active={segment === "devices"}>
        Датчики
    </a>
    <a
        href="/profile/settings/credentials"
        class:active={segment === "credentials"}
    >
        Данные
    </a>
</div>
<slot />

<style lang="sass">
    @import "colors"

    a
        display: block
        padding: .25rem .5rem
        text-decoration: none
        text-align: center
        border: .05rem solid $color-primary

        &.active
            color: $color-surface
            background-color: $color-primary

        &:not(.active)
            &,
            &:link,
            &:hover,
            &:focus,
            &:active
                color: $color-primary

            &:hover
                background-color: rgba($color-primary, .2)

    .controls
        border-radius: .5rem
        margin: .5rem 0
        overflow: hidden
        border: .05rem solid $color-primary
        color: $color-primary

    @media all and (min-aspect-ratio: 1/1)
        a
            display: inline-block
            font-size: 1rem

        .controls
            width: fit-content
            font-size: 0
            margin: .5rem auto
</style>
