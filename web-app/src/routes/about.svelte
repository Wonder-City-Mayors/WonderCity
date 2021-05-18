<script>
    import Title from "components/Title.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        const interval = setInterval(() => {
            if (typeof VK === "object") {
                clearInterval(interval);

                /* Ниже можно юзать! */

                VK.Widgets.Group("vk", { mode: 3 }, 202307354);
            }
        }, 1000);
    });
</script>

<svelte:head>
    <script type="text/javascript" src="https://vk.com/js/api/openapi.js?169">
    </script>
</svelte:head>

<Title caption="О WCM" />

<div class="diva">
    <span class="w">Волшебная водичка</span>
</div>

<h1>
    Вас приветсвует команда Wonder City Mayors. Мы - группа веселых
    прогрмаммистов или не очень, которая пытается облегчить подачу показаний
    счетчиков воды. Самым веселым и полезным членом нашей дружной команды
    является сис. анал. Георгий. a что?
</h1>

<!-- VK Widget -->
<div id="vk" />
<form
    action="https://vk.com/wondercitymayors?w=app6471849_-202307354"
    target="_blank"
>
    <button />
</form>

<style lang="scss">
    @import "global.scss";
    .w {
        font-size: 100px;
        text-align: center;
        color: white;
    }
    .im {
        height: 3%;
        width: 3%;
    }
    .diva {
        width: 100%;
        height: 3%;
        background-color: #54a474;
    }
    h1 {
        color: $mdc-theme-primary;
        margin: 0.25em 0.5em;
    }
    .im1 {
        border: 5px solid #54a474;
        width: 300px;
        height: 300px;
    }

    .d {
        display: inline;
    }
    button {
        border-radius: 10px;
        width: 300px;
        height: 150px;
        display: block;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url(http://localhost:3002/images/moneta.jpg);
    }
</style>
