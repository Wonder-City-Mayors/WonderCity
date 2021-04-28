<script>
    import { stores } from "@sapper/app";

    import Title from "components/Title.svelte";

    const { session } = stores();

    const fullName = [$session.user.firstName, $session.user.lastName]
        .filter((val) => val)
        .join(" ");
</script>

<Title caption="Профиль" />

<h2>
    Это Ваш профиль, {$session.user.username
        ? fullName
        : $session.user.username}.
</h2>
<a href="/logout" class="logout"> Выйти </a>

<style lang="sass">
    @import "colors"

    h2
        color: $color-primary
        text-align: center
        padding: .5rem 1rem

    .logout
        text-align: center
        text-decoration: none
        display: block
        margin: .5rem auto 0
        padding: .25rem .5rem
        max-width: 30rem
        color: $color-primary
            border-radius: .5rem

        &:hover
            background: rgba($color-primary, .2)

    @media all and (min-aspect-ratio: 1/1)
        a.logout
            border-radius: 0
</style>
