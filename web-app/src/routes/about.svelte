<script>
    import Title from "components/Title.svelte";
</script>

<style lang="scss">
    @import "global.scss";

    h1 {
        color: $mdc-theme-primary;
        margin: 0.25em 0.5em;
    }
    .im1 {
        border: 5px solid #29a8ae;
        width: 300px;
        height: 300px;
    }
    img {
    }
</style>

<Title caption="О WCM" />

<h1>
    Вас приветсвует команда Wonder City Mayors. Мы - группа веселых
    прогрмаммистов или не очень, которая пытается облегчить подачу показаний
    счетчиков воды. Самым веселым и полезным членом нашей дружной команды
    является сис. анал. Георгий.
</h1>

<h2><img src="http://91.146.16.157:3010/images/counter.jpg" class="im1" /></h2>
<h3>
    <a href="https://vk.com/wondercitymayors"><img
            src="http://91.146.16.157:3010/images/vk.jpg" /></a>
</h3>
