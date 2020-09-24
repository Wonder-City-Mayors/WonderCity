<script context="module">
  export async function preload(page, session) {
    return {
      props: await (await this.fetch(session.apiUrl + "/users/count")).json(),
      apiUrl: session.apiUrl,
    };
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";
  import { fly } from "svelte/transition";

  import Textfield from "../components/TextfieldWithLeadingIcon.svelte";
  import Tab, { Label } from "@smui/tab";
  import TabBar from "@smui/tab-bar";
  import Card from "@smui/card";
  import TransitionWrapper from "../components/TransitionWrapper.svelte";

  import { postApi } from "../../utils/requests.js";
  import { setCookie } from "../../utils/cookies";

  export let apiUrl, props;
  const { page, session } = stores();
  const user = $session.user;
  const tabs = ["Вход", "Регистрация"];

  let usernameEntered = false, passwordEntered = false;
  let username = '', password = '';
  let usernameError, passwordError;
  let activeIndex = 0;

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
    }

    console.log(usernameError);
  }

  $: if (password !== undefined) {
    if (password.length === 0) {
      passwordError = "Заполните это поле.";
    } else if (password.length < 8) {
      passwordError = "Пароль должен состоять как минимум из 8 символов.";
    } else {
      passwordError = "";
    }
  }

  const logout = () => goto("/logout");
  const redirect = () => goto($page.query.redirectTo || "/");

  const signin = (e) => {};
</script>

<style global lang="sass">
  @import "../theme/global"

  form
    display: flex
    flex-wrap: wrap
    color: $mdc-theme-secondary

    h3
      text-align: center

  .textfield,
  .textfield-helpertext
    width: 100%

  .signin
    &-input
      flex: 1 10rem

</style>

<svelte:head>
  <title>Авторизация • WonderCity</title>
</svelte:head>

<TransitionWrapper>
    <Card style="
      margin: 3rem auto 0;
      width: 100%;
      max-width: 40rem;
      padding: .5rem;
    ">
      {#if user.isAuthenticated}
        <div class="already-registered">
          <h1>Снова..?</h1>
          <h2>Вы уже зарегистрированы.</h2>
          <p>
            Если вы хотите войти в другой аккаунт, сначала выйдите из текущего.
          </p>
          <button class="logout" on:click={logout}> Выйти </button>
          <button class="continue" on:click={redirect}> Продолжить </button>
        </div>
      {:else}
        <TabBar {tabs} let:tab bind:activeIndex>
          <Tab {tab}>
            <Label style="
              font-family: defaultFont, sans-serif;
            ">{tab}</Label>
          </Tab>
        </TabBar>
        {#if activeIndex === 0}
          <form
            class="signin"
            in:fly={{ x: -300, duration: 300, delay: 300 }}
            out:fly={{ x: -300, duration: 300 }}>
            <div class="signin-input">
              <Textfield
                bind:value={username}
                error={usernameError}
                icon="event"
                label="Логин" />
            </div>
          </form>
        {:else}
          <form
            class="signup"
            in:fly={{ x: 300, duration: 300, delay: 300 }}
            out:fly={{ x: 300, duration: 300 }}>
            <h3>Not yet implemented, sorry.</h3>
          </form>
        {/if}
      {/if}
    </Card>
</TransitionWrapper>
