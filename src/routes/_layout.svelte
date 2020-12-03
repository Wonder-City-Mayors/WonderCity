<script>
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { stores, goto } from "@sapper/app";

  import Tab, { Icon, Label } from "@smui/tab";
  import Button from "@smui/button";
  import TabBar from "@smui/tab-bar";

  export let segment;

  const { page, session } = stores();
  const tabsElements = [];
  const pathRegEx = /^(.+?)(\?|\/)/;

  let loaded = false;
  let activeIndex = -1;

  const setActive = (newSegment) => {
    if (typeof newSegment !== "string") {
      if (loaded) {
        newSegment = "/";
      } else {
        newSegment = $page.path;
      }
    } else if (!loaded) {
      loaded = true;
    }

    if (newSegment[0] !== "/") {
      newSegment = "/" + newSegment;
    }

    for (let i = 0; i < iconTabs.length; i += 1) {
      const path = pathRegEx.exec(iconTabs[i].path);

      if ((path && newSegment === path[1]) || newSegment === iconTabs[i].path) {
        if (activeIndex !== -1) {
          transitionDirection.set(i - activeIndex);
        }

        try {
          tabsElements[activeIndex].deactivate();
        } catch (e) {}

        try {
          tabsElements[i].activate();
        } catch (e) {}

        activeIndex = i;
        return;
      }
    }

    transitionDirection.set(0);
    activeIndex = -1;

    for (let i = 0; i < tabsElements.length; i += 1) {
      try {
        tabsElements[i].deactivate();
      } catch (e) {}
    }
  };

  const updateIconTabs = (user) => {
    const newIconTabs = iconTabs.slice(0, initialTabsLength);
    let index;

    if (user.isAuthenticated) {
      index =
        newIconTabs.push({
          icon: "cast",
          label: "Отслеживание",
          path: "/monit/1",
        }) - 1;

      newIconTabs[index].index = index;

      index =
        newIconTabs.push({
          icon: "account_circle",
          label: "Профиль",
          path: "/profile",
        }) - 1;

      newIconTabs[index].index = index;
    } else {
      index =
        newIconTabs.push({
          icon: "how_to_reg",
          label: "Авторизация",
          path: "/auth",
        }) - 1;

      newIconTabs[index].index = index;
    }

    iconTabs = newIconTabs;

    setActive(segment);
  };

  let iconTabs = [
    {
      icon: "school",
      label: "О SQBit",
      path: "/about",
      index: 0,
    },
    {
      icon: "help",
      label: "FAQ",
      path: "/faq",
      index: 1,
    },
  ];
  const initialTabsLength = iconTabs.length;
  let transitionDirection = writable(0);

  setContext("transitionDirection", transitionDirection);

  $: if (tabsElements.length > 0) {
    setActive(segment);
  }

  $: updateIconTabs($session.user);
</script>

<style global lang="scss">
  @import "global";

  @font-face {
    font-family: defaultFont;
    font-weight: 400;
    font-style: normal;
    src: url("/fonts/Bellota-Regular.ttf");
  }

  @font-face {
    font-family: defaultFont;
    font-weight: 700;
    font-style: normal;
    src: url("/fonts/Bellota-Bold.ttf");
  }

  @font-face {
    font-family: defaultFont;
    font-weight: 400;
    font-style: italic;
    src: url("/fonts/Bellota-Italic.ttf");
  }

  @font-face {
    font-family: defaultFont;
    font-weight: 700;
    font-style: italic;
    src: url("/fonts/Bellota-BoldItalic.ttf");
  }

  * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    vertical-align: baseline;
    background: transparent;
    z-index: 0;
    box-sizing: border-box;
  }

  html {
    font-size: calc(1vw + 2vh);
    font-family: defaultFont, serif;
    height: 100%;
  }

  body {
    height: 100%;
    overflow-x: hidden;
  }

  .layout-header {
    @include small_box_shadow_primary;

    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 3rem;
    background: white;
    z-index: 2;

    a {
      text-decoration: none;
    }

    .top-nav {
      display: flex;
      height: 100%;

      &-logo {
        font-family: defaultFont, serif;
        order: 1;
        flex: 0 0 auto;
        display: flex;
        padding: 0.25rem 0.5rem;
        height: 100%;

        &-icon {
          width: 2.5rem;
          font-size: 2.5rem;
          margin-right: 0.5rem;
        }

        &-caption {
          font-weight: 700;
          font-size: 1.5rem;
        }
      }

      &::before {
        content: "";
        order: 2;
        flex: 1;
      }

      &-tabs {
        order: 3;
        width: auto;
        height: 102.5%;

        *[class^="mdc-tab-scroller"] {
          height: 100%;
        }

        .mdc-tab-scroller__scroll-area--scroll {
          overflow-x: hidden;
        }

        &-tab {
          height: 100%;
          font-family: defaultFont, serif;
          font-weight: 700;
        }
      }
    }
  }

  main {
    position: relative;
    padding-top: 3rem;
    height: 100%;
  }

  @media all and (orientation: landscape) {
    html {
      font-size: calc(1vw + 1vh);
    }
  }
</style>

<header class="layout-header">
  <nav class="top-nav">
    <a href="/">
      <Button color="primary" class="top-nav-logo">
        <span class="material-icons top-nav-logo-icon">insights</span>
        <span class="top-nav-logo-caption">ВундерВафля</span>
      </Button>
    </a>
    <TabBar
      tabs={iconTabs}
      class="top-nav-tabs"
      let:tab
      active={iconTabs[activeIndex]}>
      <a href={tab.path}>
        <Tab
          {tab}
          minWidth
          class="top-nav-tabs-tab"
          bind:this={tabsElements[tab.index]}>
          <Icon class="material-icons">{tab.icon}</Icon>
          <Label>{tab.label}</Label>
        </Tab>
      </a>
    </TabBar>
  </nav>
</header>
<main>
  <slot />
</main>
