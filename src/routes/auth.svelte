<script>
  import { goto, stores } from "@sapper/app";
  import { onMount } from "svelte";

  import Tab, { Label } from "@smui/tab";
  import TabBar from "@smui/tab-bar";
  import Card from "@smui/card";
  import TransitionWrapper from "../components/TransitionWrapper.svelte";
  import SignIn from "../components/auth/SignIn.svelte";
  import SignUp from "../components/auth/SignUp.svelte";

  import { setCookie } from "../../utils/cookies";

  const { page, session } = stores();
  const user = $session.user;
  const tabs = ["Вход", "Регистрация"];

  let formsWrapper, signInForm, signUpForm;

  let activeIndex = 0;

  onMount(
    () =>
      (formsWrapper.style.height =
        (signInForm ? signInForm.offsetHeight : signUpForm.offsetHeight) + "px")
  );

  $: if (formsWrapper) {
    if (activeIndex === 0 && signInForm) {
      formsWrapper.style.height = signInForm.offsetHeight + "px";
    } else if (signUpForm) {
      formsWrapper.style.height = signUpForm.offsetHeight + "px";
    }
  }

  const logout = () => goto("/logout");
  const redirect = () => goto($page.query.redirectTo || "/");

  const signedIn = (e) => {
    setCookie("jwt", e.jwt, {
      sameSite: "Strict",
      maxAge: 1296000,
    });

    session.update((oldSession) => {
      oldSession.user = e.user;
      return oldSession;
    });

    redirect();
  };
</script>

<style lang="sass">
  @import '../theme/colors'

  :global(.authentication-card)
    width: 100%
    max-width: 40rem
    overflow: hidden

    :global(.authentication-card-controls)
      height: 3rem

    .authentication-card-forms
      position: relative
      height: 0
      transition: height .3s ease

      :global(form)
        position: absolute
        top: 0
        left: 0
        width: 100%
        padding: .5rem
        text-align: right
        color: $mdc-theme-secondary

        :global(.fields)
          display: flex
          flex-wrap: wrap

          :global(.textfield-container)
            flex: 1 0 15rem

        :global(.submit)
          display: inline-block
          margin: .25rem .5rem
          font-family: defaultFont
          font-weight: 700
</style>

<svelte:head>
  <title>Авторизация • WonderCity Reborn</title>
</svelte:head>

<TransitionWrapper centered>
  <Card class="authentication-card">
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
      <TabBar
        class="authentication-card-controls"
        {tabs}
        let:tab
        bind:activeIndex>
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
      <div bind:this={formsWrapper} class="authentication-card-forms">
        {#if activeIndex === 0}
          <SignIn on:signedin={signedIn} bind:element={signInForm} />
        {:else}
          <SignUp bind:element={signUpForm} />
        {/if}
      </div>
    {/if}
  </Card>
</TransitionWrapper>
