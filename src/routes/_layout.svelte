<script>
  import Tab, { Icon, Label } from "@smui/tab";
  import Button, {
    Icon as ButtonIcon,
    Label as ButtonLabel,
  } from "@smui/button";
  import TabBar from "@smui/tab-bar";
  import { stores, goto } from "@sapper/app";

  const { page } = stores();
  const iconTabs = [
    {
      icon: "school",
      label: "О нас",
      path: "/about",
      index: 0
    },
    {
      icon: "help",
      label: "FAQ",
      path: "/faq",
      index: 1
    },
    {
      icon: "how_to_reg",
      label: "Авторизация",
      path: "/auth",
      index: 2
    },
  ];
  const tabsElements = new Array();

  const setActive = (location) => {
    if (location.path.substring(0, 6) === "/about") {
      activeIndex = 0;
    } else if (location.path.substring(0, 4) === "/faq") {
      activeIndex = 1;
    } else if (location.path.substring(0, 5) === "/auth") {
      activeIndex = 2;
    } else {
      activeIndex = -1;
    }
  };

  const goHome = () => {
    goto('/');

    for (let i = 0; i < tabsElements.length; i += 1) {
      tabsElements[i].deactivate();
    }
  };

  let activeIndex;

  setActive($page);

  page.subscribe(setActive);
</script>

<style global lang="scss">
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
  }

  @media all and (orientation: landscape) {
    html {
      font-size: calc(1vw + 1vh);
    }
  }
</style>

<main>
  <header class="layout-header">
    <nav class="top-nav">
      <Button color="primary" on:click={goHome}>
        <ButtonIcon class="material-icons">insights</ButtonIcon>
        <ButtonLabel>wondercity</ButtonLabel>
        <ButtonLabel>reborn</ButtonLabel>
      </Button>
      <TabBar
        tabs={iconTabs}
        let:tab
        bind:activeIndex
      >
        <Tab
          {tab}
          minWidth
          on:click={() => goto(tab.path)}
          bind:this={tabsElements[tab.index]}
        >
          <Icon class="material-icons">
            {tab.icon}
          </Icon>
          <Label>{tab.label}</Label>
        </Tab>
      </TabBar>
    </nav>
  </header>
  <slot />
</main>
