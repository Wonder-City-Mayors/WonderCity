<script context="module">
    export async function preload(_page, session) {
        if (session.user.isAuthenticated) {
            return {};
        }

        this.redirect(301, "/");
    }
</script>

<script>
    import { stores } from "@sapper/app";

    export let segment;

    $: console.log(segment);

    const { session } = stores();
</script>

<section class="profile-layout">
    <header>
        <a href="/profile" class:active={segment === undefined}>
            {$session.user.username}
        </a>
        <a
            href="/profile/settings/devices"
            class:active={segment === "settings"}
        >
            Настройки
        </a>
    </header>
    <slot />
</section>

<style lang="sass">
    @import "colors"

    .profile-layout
        padding: .25rem .5rem

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

    header
        color: $color-primary
        border-radius: .5rem
        overflow: hidden
        display: flex
        flex-direction: column
        border: .05rem solid $color-primary

    @media all and (min-aspect-ratio: 1/1)
        a
            display: inline-block
            font-size: 1rem

        header
            width: fit-content
            font-size: 0
            display: block
            margin: .5rem auto
</style>
