<script>
    import { stores } from "@sapper/app";

    import Title from "components/Title.svelte";

    const { session } = stores();
    let GoodMorning = [
        "おはようございます, ",
        "Good morning, ",
        "Guten Morgen, ",
        "Доброе утро, ",
        "C началом нового дня, ",
        "Қайырлы таң, ",
        "С добрым утром! ",
        "Buenos días, ",
        "Доброго ранку, ",
        "Dzień dobry, ",
        "Bonjour, ",
        "Слава Богу, ты пришёл, ",
    ];
    let GoodPM = [
        "Добрый день, ",
        "Guten <Tag>! ",
        "Good afternoon, ",
        "良い一日, ",
        "Қайырлы күн, ",
        "Buenas tardes, ",
        "Доброго дня, ",
        "Слава Богу, ты пришёл, ",
    ];
    let GoodEvning = [
        "Добрый вечер, ",
        "Добрий вечір, ",
        "Guten Abend, ",
        "Buonasera, ",
        "Қайырлы кеш, ",
        "こんばんは, ",
        "Buena tarde, ",
        "Слава Богу, ты пришёл, ",
    ]; // Buonasera Итальянский Buenos días, Buenas tardes, Buena tarde Испанский Еще немецкий и Украинский
    let GmLength = GoodMorning.length; // + 1; Я убрал +1, поскольку
    let GpmLength = GoodPM.length; // + 1; иногда возвращал undefined.
    let GevnLength = GoodEvning.length; // +1; Math.random() может возвращать 1
    let Date1 = new Date();
    let Hours1 = Date1.getHours();

    function RandomNumbers(MaxNumber) {
        return Math.floor(Math.random() * MaxNumber);
    }

    let Random1 = RandomNumbers(GmLength);
    let Random2 = RandomNumbers(GpmLength);
    let Random3 = RandomNumbers(GevnLength);
</script>

<style lang="sass">
  @import "colors"

  h1
    color: $mdc-theme-secondary
    text-align: center
</style>

<Title caption="Главная" />

{#if $session.user.isAuthenticated}
    {#if 0 <= Hours1 && Hours1 <= 12}
        <h1>
            {GoodMorning[Random1]}{$session.user.firstName || $session.user.username}!
        </h1>
    {/if}
    {#if 12 <= Hours1 && Hours1 <= 16}
        <h1>
            {GoodPM[Random2]}{$session.user.firstName || $session.user.username}!
        </h1>
    {/if}
    {#if Hours1 >= 16 && Hours1 <= 23}
        <h1>
            {GoodPM[Random3]}{$session.user.firstName || $session.user.username}!
        </h1>
    {/if}
{:else}
    {#if 0 <= Hours1 && Hours1 <= 12}
        <h1>{GoodMorning[Random1].slice(0, -2) + '.'}</h1>
    {/if}
    {#if 12 <= Hours1 && Hours1 <= 16}
        <h1>{GoodPM[Random2].slice(0, -2) + '.'}</h1>
    {/if}
    {#if 16 <= Hours1 && Hours1 <= 23}
        <h1>{GoodEvning[Random3].slice(0, -2) + '.'}</h1>
    {/if}
{/if}
