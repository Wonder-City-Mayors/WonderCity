<script>
  import { stores } from "@sapper/app";
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  import Textfield from "../Textfield.svelte";
  import Button, { Label, Icon } from "@smui/button";

  import { postApi } from "../../../utils/requests.js";

  export let element;

  let usernameEntered = false,
    passwordEntered = false;
  let username = "",
    password = "";
  let usernameError, passwordError;
  let promise;

  const dispatch = createEventDispatcher();
  const { session } = stores();

  $: {
    if (username.length > 0 && !usernameEntered) {
      usernameEntered = true;
    }

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

      element = element;
    }
  }

  $: {
    if (password.length > 0 && !passwordEntered) {
      passwordEntered = true;
    }

    if (passwordEntered) {
      if (password.length === 0) {
        passwordError = "Заполните это поле.";
      } else if (password.length < 8) {
        passwordError = "Пароль должен состоять как минимум из 8 символов.";
      } else {
        passwordError = "";
      }

      element = element;
    }
  }

  $: disabled = passwordError || usernameError;

  const signin = (e) => {
    if (passwordEntered && usernameEntered) {
      if (!disabled) {
        promise = new Promise((resolve, reject) => {
          postApi($session.apiUrl + "/users/signin", {
            username,
            password,
          }).then((res) => {
            if (res.ok) {
              res.json().then(
                (json) => resolve(json),
                (e) => reject(e)
              );
            } else {
              console.log(res);
              reject(res);
            }
          });
        });

        promise.then(
          (json) => {
            dispatch("signedin", json);
          },
          (e) => {
            console.log(e);
          }
        );
      }
    } else {
      usernameEntered = true;
      passwordEntered = true;
    }
  };
</script>

<style lang="sass">
  @import "../../theme/global.scss"

  .error
    text-align: center
    color: $mdc-theme-error
    font-size: .8rem
    width: 85%
    margin: .25rem auto

  .await
    text-align: right
    color: $mdc-theme-primary
    margin: .25rem .5rem
</style>

<form
  bind:this={element}
  class="signin"
  on:submit|preventDefault={signin}
  transition:fly={{ x: -300, duration: 300 }}>
  <div class="fields">
    <Textfield bind:value={username} error={usernameError} label="Логин" />
    <Textfield
      type="password"
      bind:value={password}
      error={passwordError}
      label="Пароль" />
  </div>
  {#if promise}
    {#await promise}
      <p class="await">Ждём ответа...</p>
    {:then resolved}
      <p class="await">Перенаправляем...</p>
    {:catch e}
      <p class="error">
        К сожалению, что-то пошло не так. Пожалуйста, перезагрузите страницу и
        попробуйте снова.
      </p>
    {/await}
  {:else}
    <Button {disabled} class="submit" variant="raised">
      <Icon class="material-icons">login</Icon>
      <Label>Войти</Label>
    </Button>
  {/if}
</form>
