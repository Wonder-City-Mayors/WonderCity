<script>
  import Tab, {Icon, Label} from "@smui/tab";
  import Button from "@smui/button";
  import TabBar from "@smui/tab-bar";
  import {stores, goto} from "@sapper/app";

  const {page} = stores();
  const iconTabs = [
    {
      icon: "school",
      label: "О нас",
      path: "/about",
      index: 0,
    },
    {
      icon: "help",
      label: "FAQ",
      path: "/faq",
      index: 1,
    },
    {
      icon: "how_to_reg",
      label: "Авторизация",
      path: "/auth",
      index: 2,
    },
  ];
  const tabsElements = [];

  const setActive = (location) => {
    if (location.path.substring(0, 6) === "/about") {
      activeIndex = 0;
    } else if (location.path.substring(0, 4) === "/faq") {
      activeIndex = 1;
    } else if (location.path.substring(0, 5) === "/auth") {
      activeIndex = 2;
    } else {
      activeIndex = -1;

      for (let i = 0; i < tabsElements.length; i += 1) {
        tabsElements[i].deactivate();
      }
    }
  };

  let activeIndex;

  setActive($page);

  page.subscribe(setActive);
</script>

<style global lang="scss">
  @import "../theme/global";

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
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 3rem;
    background: white;
    z-index: 2;
    box-shadow: 0 0 .2rem $mdc-theme-primary;

    .top-nav {
      display: flex;
      height: 100%;

      &-logo {
        font-family: defaultFont,serif;
        order: 1;
        flex: 0 0 auto;
        display: flex;
        padding: .25rem .5rem;
        height: 100%;

        &-icon {
          width: 2.5rem;
          font-size: 2.5rem;
          margin-right: .5rem;
        }

        &-caption {
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          &-max {
            font-weight: 700;
            font-size: 1.5rem;
          }

          &-min {
            font-size: .75rem;
            margin-right: .5rem;
          }
        }
      }

      &::before {
        content: '';
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

        &-tab {
          height: 100%;
          font-family: defaultFont, serif;
          font-weight: 700;
        }
      }
    }
  }

  main {
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
      <Button color="primary" class="top-nav-logo" on:click={() => goto('/')}>
        <span class="material-icons top-nav-logo-icon">insights</span>
        <div class="top-nav-logo-caption">
          <span class="top-nav-logo-caption-max">WonderCity</span>
          <span class="top-nav-logo-caption-min">REBORN</span>
        </div>
      </Button>
      <TabBar tabs={iconTabs} class="top-nav-tabs" let:tab bind:activeIndex>
        <Tab
          {tab}
          minWidth
          on:click={() => goto(tab.path)}
          class="top-nav-tabs-tab"
          bind:this={tabsElements[tab.index]}>
          <Icon class="material-icons">{tab.icon}</Icon>
          <Label>{tab.label}</Label>
        </Tab>
      </TabBar>
    </nav>
  </header>
<main>
  <slot />
</main>
