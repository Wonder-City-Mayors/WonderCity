<script>
    import { stores } from "@sapper/app";
    import { fly } from "svelte/transition";
    import { createEventDispatcher } from "svelte";

    import { mdiLogin } from "@mdi/js";

    import Textfield from "../Textfield.svelte";
    import SubmitButton from "./SubmitButton.svelte";

    import { postApi } from "requests";

    export let element;
    export let active;

    const dispatch = createEventDispatcher();
    const { session } = stores();

    let usernameEntered = false;
    let passwordEntered = false;
    let passwordRepeatEntered = false;
    let wrongUsername = false;
    let username = "";
    let password = "";
    let passwordRepeat = "";
    let usernameError;
    let passwordError;
    let passwordRepeatError;
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
    const checkPasswordRepeatEntered = () => {
        if (passwordRepeat.length > 0 && !passwordRepeatEntered) {
            passwordRepeatEntered = true;
        }
    };
    const checkWrongUsername = () => {
        if (wrongUsername) {
            wrongUsername = false;
        }
    };

    $: {
        checkUsernameEntered();
        checkWrongUsername();

        if (usernameEntered) {
            if (username.length === 0) {
                usernameError = "Заполните это поле.";
            } else if (/[^0-9a-zA-Z#$*_]/.test(username)) {
                usernameError =
                    "Логин может состоять только из английских букв, цифр и знаков" +
                    " #, $, *, _.";
            } else {
                usernameError = "";
            }
        }
    }
    $: {
        checkPasswordEntered();

        if (passwordEntered) {
            if (password.length === 0) {
                passwordError = "Заполните это поле.";
            } else if (password.length < 8) {
                passwordError =
                    "Пароль должен состоять как минимум из 8 символов.";
            } else {
                passwordError = "";
            }
        }
    }
    $: {
        checkPasswordRepeatEntered();

        if (passwordRepeatEntered) {
            if (passwordRepeat.length === 0) {
                passwordRepeatError = "Заполните это поле.";
            } else if (passwordRepeat !== password) {
                passwordRepeatError = "Пароли не совпадают.";
            } else {
                passwordRepeatError = "";
            }
        }
    }
    $: disabled = usernameError || passwordError || passwordRepeatError;

    const signup = () => {
        if (usernameEntered && passwordEntered && passwordRepeatEntered) {
            if (!disabled) {
                promise = postApi($session.apiUrl + "/users/signup", {
                    username,
                    password,
                });

                promise
                    .then((json) => {
                        dispatch("signed", json);
                    })
                    .catch((e) => {
                        if (e.status === 403) {
                            promise = null;
                            wrongUsername = true;
                        }
                    });
            }
        } else {
            usernameEntered = true;
            passwordEntered = true;
            passwordRepeatEntered = true;
        }
    };
</script>

<form
    bind:this={element}
    class="signup {active ? 'active' : 'unactive'}"
    on:submit|preventDefault={signup}
    transition:fly={{ x: 300, duration: 300 }}
>
    <div class="fields">
        <Textfield bind:value={username} error={usernameError} label="Логин" />
    </div>
    <div class="fields">
        <Textfield
            type="password"
            bind:value={password}
            error={passwordError}
            label="Пароль"
        />
        <Textfield
            type="password"
            bind:value={passwordRepeat}
            error={passwordRepeatError}
            label="Повтор пароля"
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
    {:else if wrongUsername}
        <p class="error">Этот логин уже занят.</p>
        <SubmitButton disabled icon={mdiLogin} label="регистрация" />
    {:else}
        <SubmitButton {disabled} icon={mdiLogin} label="регистрация" />
    {/if}
</form>

<style lang="scss">
    @import "colors";

    form.signup {
        display: flex;
        flex-wrap: wrap;
        color: $mdc-theme-secondary;
        transition: opacity 0.3s ease, transform 0.3s ease;

        &.active {
            position: static;
            transform: none;
            opacity: 1;
        }

        &.unactive {
            position: absolute;
            transform: translateX(10rem);
            opacity: 0;
        }
    }
</style>
