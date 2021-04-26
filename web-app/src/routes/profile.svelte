<script lang="ts">
    import { stores } from "@sapper/app";
    import Title from "components/Title.svelte";
    import Input from "components/Input.svelte";
    import Btn from "components/Btn.svelte";

    import { postApi } from "utils/requests";

    let deviceId;
    let newName;
    let newLastName;
    let newEmail;
    let newPassword;

    const { session } = stores();

    function addDevice() {
        postApi(
            $session.apiUrl + "/user/addDevice",
            {
                id: deviceId,
            },
            true
        ).then(
            (gut) => {
                alert("Всё готово!");
            },
            (bad) => {
                alert("Ты чё?");
            }
        );
    }

    function changeName() {
        postApi(
            $session.apiUrl + "/user/changeName",
            {
                name: newName,
            },
            true
        ).then(
            (gut) => {
                alert("Всё готово!");
            },
            (bad) => {
                alert("Пипец.");
            }
        );
    }

    /**
     * Обработчик клика на кнопку, который отправляет запрос для
     * смены фамилии
     */
    function changeLastName() {
        postApi(
            $session.apiUrl + "/user/changeLastName",
            {
                lastName: newLastName,
            },
            true
        ).then(
            (gut) => {
                alert("НУ вроде ОК");
            },
            (bad) => {
                alert("Неа, не сменил");
            }
        );
    }

    /**
     * Обработчик клика на кнопку, который отправляет запрос для
     * смены электронной почты
     */
    function changeEmail() {
        postApi(
            $session.apiUrl + "/user/changeEmail",
            {
                email: newEmail,
            },
            true
        ).then(
            (gut) => {
                alert("НЕ ссы, спама не будет");
            },
            (bad) => {
                alert("Старая осталась");
            }
        );
    }

    /**
     * Обработчик клика на кнопку, который отправляет запрос для
     * смены пароля
     */
    function changePassword() {
        postApi(
            $session.apiUrl + "/user/changePassword",
            {
                password: newPassword,
            },
            true
        ).then(
            (gut) => {
                alert("Новый не забудь как старый");
            },
            (bad) => {
                console.log(bad);
            }
        );
    }
</script>

<Title caption="Профиль" />

<div id="d">
    <Input bind:value={deviceId} placeholder="Идентификатор датчика" />

    <Btn on:click={addDevice}>Нажми меня</Btn>

    <Input bind:value={newName} placeholder="Имя" />

    <Btn on:click={changeName}>Нажми меня</Btn>

    <Input bind:value={newLastName} placeholder="Фамилия" />

    <Btn on:click={changeLastName}>Нажми меня</Btn>

    <Input bind:value={newEmail} placeholder="Электронная почта" />

    <Btn on:click={changeEmail}>Нажми меня</Btn>

    <Input bind:value={newPassword} placeholder="Пароль" />

    <Btn on:click={changePassword}>Нажми меня</Btn>
</div>

<style>
    #d {
        margin: auto;
        width: 10rem;
    }
</style>
