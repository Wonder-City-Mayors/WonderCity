<script>
  import { goto, stores } from "@sapper/app";

  import Tab, { Label } from "@smui/tab";
  import TabBar from "@smui/tab-bar";

  import Button from "Button.svelte";
  import TransitionWrapper from "TransitionWrapper.svelte";
  import SignIn from "auth/SignIn.svelte";
  import SignUp from "auth/SignUp.svelte";

  import { setCookie } from "../../utils/cookies";

  const { page, session } = stores();
  const user = $session.user;
  const tabs = ["Вход", "Регистрация"];

  let signInForm, signUpForm;

  let activeIndex = 0;

  $: {
    const [active, passive] = activeIndex
      ? [signUpForm, signInForm]
      : [signInForm, signUpForm];

    if (active) {
      active.classList.add("active");
    }

    if (passive) {
      passive.classList.remove("active");
    }
  }

  const logout = () => goto("/logout");
  const redirect = () => goto($page.query.redirectTo || "/");

  const signed = (e) => {
    setCookie("jwt", e.detail.jwt, {
      sameSite: "Strict",
      maxAge: 1296000,
    });

    session.update((oldSession) => {
      oldSession.user = e.detail.data;
      return oldSession;
    });

    console.log($page.query.redirectTo);
    redirect();
  };
</script>

<style lang="sass">
  @import '../theme/global'

  .authentication-forms-container
    position: relative
    margin: 0 auto
    max-width: 40rem

    :global(form)
      width: 100%
      padding: .5rem
      text-align: right
      color: $mdc-theme-secondary

      &:not(.active)
        position: absolute
        top: 0
        left: 0

      &.active
        position: static

      :global(.fields)
        display: flex
        flex-wrap: wrap
        width: 100%

        :global(.textfield-container)
          flex: 1 0 15rem

      :global(.submit)
        display: inline-block
        margin: .25rem .5rem

      :global(p.error)
        text-align: center
        color: $mdc-theme-error
        font-size: .8rem
        width: 85%
        margin: .25rem auto

      :global(p.await)
        text-align: right
        color: $mdc-theme-primary
        margin: .25rem .5rem
</style>

<svelte:head>
  <title>Авторизация • WonderCity Reborn</title>
</svelte:head>

<TransitionWrapper>
  {#if user.isAuthenticated}
    <div class="already-registered">
      <h1>Снова..?</h1>
      <h2>Вы уже зарегистрированы.</h2>
      <p>Если вы хотите войти в другой аккаунт, сначала выйдите из текущего.</p>
      <Button
        class="logout"
        variant="raised"
        color="secondary"
        on:click={logout}
        icon="person_remove"
        label="Выйти" />
      <Button
        class="continue"
        variant="raised"
        on:click={redirect}
        icon="check_circle"
        label="Продолжить" />
    </div>
  {:else}
    <TabBar {tabs} let:tab bind:activeIndex>
      <Tab {tab}>
        <Label
          style="
              font-family: defaultFont, sans-serif;
              font-weight: 700;
            ">
          {tab}
        </Label>
      </Tab>
    </TabBar>
    <div class="authentication-forms-container">
      {#if activeIndex === 0}
        <SignIn on:signed={signed} bind:element={signInForm} />
      {:else}
        <SignUp on:signed={signed} bind:element={signUpForm} />
      {/if}
    </div>
  {/if}
</TransitionWrapper>
