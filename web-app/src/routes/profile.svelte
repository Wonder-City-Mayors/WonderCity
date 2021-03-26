<script>
    import TransitionWrapper from "components/TransitionWrapper.svelte";
    import Title from "components/Title.svelte";
    import Input from "components/TextField.svelte";
    import Btn from "components/Btn.svelte";

    import { postApi } from "utils/requests";

    let deviceId;
    let newName;
    let newLastName;
    let newEmail;
    let newPassword;

    function addDevice() {
        postApi(
            "/api/users/addDevice",
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
            "/api/users/changeName",
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
            "/api/users/changeLastName",
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
            "/api/users/changeEmail",
            {
                email: newemail,
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
            "/api/users/changePassword",
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

<TransitionWrapper>
    <div id="d">
        <Input rt="как это делать"/>
        <Btn>Тыкни сюда</Btn>
        <input
            bind:value={deviceId}
            placeholder="Идентификатор датчика"
            id="f"
        />
        <Btn on:click={addDevice}>Нажми меня</Btn>
        <input bind:value={newName} placeholder="Имя" id="f" />
        <Btn on:click={changeName}>Нажми меня</Btn>
        <br />
        <input bind:value={newLastName} placeholder="Фамилия" id="f" />
        <Btn on:click={changeLastName}>Нажми меня</Btn>
        <br />
        <input bind:value={newEmail} placeholder="Электронная почта" id="f" />
        <Btn on:click={changeEmail}>Нажми меня</Btn>
        <br />
        <input bind:value={newPassword} placeholder="Пароль" id="f" />
        <Btn on:click={changePassword}>Нажми меня</Btn>
        <br />
    </div>
</TransitionWrapper>

<style>
    #d {
        margin: auto;
        width: 10rem;
    }
    #f {
        border-radius: 30px 30px 30px 30px;
        background-color: #0bdb38;
        border-color: black;
    }
    #but:hover {
        background-color: #d4e20c;
    }

    #but:active {
        background-color: #c22257;
        border-top: 1px solid rgba(0, 0, 0, 0.5);
        border-left: 1px solid rgba(0, 0, 0, 0.5);
        border-bottom: none;
        border-right: none;
    }
</style>
