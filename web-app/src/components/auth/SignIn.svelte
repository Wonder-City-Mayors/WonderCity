<script>
    import { stores } from "@sapper/app";
    import { createEventDispatcher } from "svelte";
    import { postApi } from "utils/requests";
    import Textfield from "../Input.svelte";
    import SubmitButton from "./SubmitButton.svelte";

    export let element;
    export let active;

    const dispatch = createEventDispatcher();
    const { session } = stores();

    let usernameEntered = false;
    let passwordEntered = false;
    let wrongPassword = false;
    let username = "";
    let password = "";
    let usernameError;
    let passwordError;
    let promise;

    const checkUsernameEntered = () => {
        if (username.length > 0 && !usernameEntered) {
            usernameEntered = true;
        }
    };

    const checkPasswordEntered = () => {
        if (password.length > 0 && !passwordEntered) {
            passwordEntered = true;
        }
    };

    $: disabled = passwordError || usernameError || wrongPassword;

    function checkWrongPassword() {
        if (wrongPassword) {
            wrongPassword = false;
        }
    }

    function validateUsername(username) {
        if (username.length === 0) {
            return "Заполните это поле.";
        } else if (/[^0-9a-zA-Z#$*_]/.test(username)) {
            return (
                "Логин может состоять только из английских букв, " +
                "цифр и знаков #, $, *, _."
            );
        }
    }

    function validatePassword(password) {
        checkWrongPassword();

        if (password.length === 0) {
            return "Заполните это поле.";
        } else if (password.length < 8) {
            return "Пароль должен состоять как минимум из 8 символов.";
        }
    }

    function logIn(e) {
        if (passwordEntered && usernameEntered) {
            if (!disabled) {
                promise = postApi($session.apiUrl + "/auth/signIn", {
                    username,
                    password,
                });

                promise.then(
                    (json) => {
                        dispatch("signed", json);
                    },
                    (e) => {
                        if (e.status === 401) {
                            promise = null;
                            wrongPassword = true;
                        }
                    }
                );
            }
        } else {
            usernameEntered = true;
            passwordEntered = true;
        }
    }
</script>

<form
    bind:this={element}
    class="signin {active ? 'active' : 'unactive'}"
    on:submit|preventDefault={logIn}
>
    <div class="fields">
        <Textfield
            placeholder="Логин"
            validation={validateUsername}
            bind:value={username}
            bind:error={usernameError}
            bind:interacted={usernameEntered}
        />
        <Textfield
            type="password"
            placeholder="Пароль"
            validation={validatePassword}
            bind:value={password}
            bind:error={passwordError}
            bind:interacted={passwordEntered}
        />
    </div>
    {#if promise}
        {#await promise}
            <p class="await">Ждём ответа...</p>
        {:then resolved}
            <p class="await">Перенаправляем...</p>
        {:catch e}
            <p class="error">
                К сожалению, произошла какая-то&nbsp; ошибка. Пожалуйста,
                попробуйте снова через&nbsp; пару минут или обратитесь к
                администратору.
            </p>
        {/await}
    {:else if wrongPassword}
        <p class="error">Неправильный логин или пароль.</p>
        <SubmitButton disabled />
    {:else}
        <SubmitButton {disabled} />
    {/if}
</form>

<style lang="scss">
    form.signin {
        transition: opacity 0.3s ease, transform 0.3s ease;

        &.active {
            position: static;
            transform: none;
            opacity: 1;
        }

        &.unactive {
            position: absolute;
            transform: translateX(-10rem);
            opacity: 0;
        }
    }
</style>
