<script>
    import { deleteCookie } from "utils/cookies";
    import { onMount } from "svelte";
    import { stores, goto } from "@sapper/app";

    const { session } = stores();

    onMount(() => {
        deleteCookie("jwt");

        session.update((oldSession) => {
            oldSession.user = {
                isAuthenticated: false,
            };

            return oldSession;
        });

        goto("/");
    });
</script>

<svelte:head>
    <title>Выход • WonderCity Reborn</title>
</svelte:head>

<div class="logout">
    <h2>Выходим, выходим, выходим!</h2>
    <h3>Наступят времена почище.</h3>
</div>

<style lang="scss">
    @import "../theme/colors";

    .logout {
        margin: 0 auto;
        padding: 3rem 0;
        width: 90%;
        max-width: 35rem;

        h2,
        h3 {
            color: $mdc-theme-primary;
            text-align: left;
        }
    }
</style>
