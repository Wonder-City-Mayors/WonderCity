<script lang="ts">
    import { stores } from "@sapper/app";
    import { cubicIn, quadInOut } from "svelte/easing";

    import {
        mdiSchool,
        mdiHelp,
        mdiAccountCircle,
        mdiCast,
        mdiAccountCheck,
        mdiCreation,
        mdiArrowUp,
    } from "@mdi/js";

    import Main from "components/TransitionedMain.svelte";
    import Icon from "components/Icon.svelte";

    export let segment: string | undefined;

    const { page, session } = stores();

    let navOpened = false;
    let loaded = false;
    let activeIndex = -1;
    let activeHref = "";
    let iconTabs = [
        {
            icon: mdiCreation,
            label: "Главная",
            path: "/",
        },
        {
            icon: mdiSchool,
            label: "О WCM",
            path: "/about",
        },
        {
            icon: mdiHelp,
            label: "FAQ",
            path: "/faq",
        },
    ];

    const initialTabsLength = iconTabs.length;

    function slide(node: Element, { duration = 300 }) {
        const initialWidth = node.clientWidth;

        return {
            duration,
            css: (t: number) => {
                const eased = cubicIn(t);

                return `
                    width: ${initialWidth * eased}px;
                    transform: scaleX(${t});
                    transform-origin: left;
                `;
            },
        };
    }

    function translateSlide(node: Element, { duration = 300 }) {
        return {
            duration,
            css: (t: number) => {
                const eased = quadInOut(t);

                return `
                    transform: translateY(${100 * (1 - eased)}%);
                `;
            },
        };
    }

    function setActiveTab() {
        activeHref = segment;

        if (typeof activeHref !== "string") {
            if (loaded) activeHref = "/";
            else activeHref = $page.path;
        } else if (!loaded) {
            loaded = true;
        }

        if (activeHref[0] !== "/") activeHref = "/" + activeHref;

        for (let i = 0; i < iconTabs.length; i++) {
            if (iconTabs[i].path === activeHref) {
                activeIndex = i;
                return;
            }
        }
    }

    $: if (typeof segment) {
        setActiveTab();
    }

    const updateIconTabs = (user) => {
        const newIconTabs = iconTabs.slice(0, initialTabsLength);

        if (user.isAuthenticated) {
            newIconTabs.push(
                {
                    icon: mdiCast,
                    label: "Отслеживание",
                    path: "/monit/1",
                },
                {
                    icon: mdiAccountCircle,
                    label: "Профиль",
                    path: "/profile",
                }
            );
        } else {
            newIconTabs.push({
                icon: mdiAccountCheck,
                label: "Авторизация",
                path: "/auth",
            });
        }

        iconTabs = newIconTabs;

        setActiveTab();
    };

    $: updateIconTabs($session.user);
</script>

<nav class:opened={navOpened}>
    {#if navOpened}
        <div class="extended" transition:translateSlide>
            {#each iconTabs as iconTab, i (i)}
                <a
                    class="activatable nav-tile"
                    class:active={activeIndex === i}
                    href={iconTab.path}
                >
                    <div class="icon-container">
                        <Icon icon={iconTab.icon} />
                    </div>
                    <p class="nav-tile-title">
                        {iconTab.label}
                    </p>
                </a>
            {/each}
        </div>
    {/if}
    <div class="little">
        <div
            class="activatable trigger icon-container"
            class:active={navOpened}
            on:click={() => (navOpened = !navOpened)}
        >
            <Icon icon={mdiArrowUp} />
        </div>
        {#if !navOpened}
            {#each iconTabs as iconTab, i (i)}
                <a
                    class="activatable nav-tile icon-container"
                    class:active={activeIndex === i}
                    href={iconTab.path}
                    transition:slide
                >
                    <Icon icon={iconTab.icon} />
                </a>
            {/each}
        {/if}
    </div>
</nav>
{#key segment}
    <Main>
        <slot />
    </Main>
{/key}

<style global lang="scss">
    @import "global";

    $aside-side: 3rem;

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

    :root {
        font-size: calc(0.5vw + 1vh + 10px);
        font-family: defaultFont, serif;
        height: 100%;
    }

    body {
        height: 100%;
        overflow-x: hidden;
    }

    nav {
        .little,
        .extended {
            position: fixed;
            width: 100%;
            left: 0;
            color: $color-primary;
            font-size: 1.5rem;
            background: $color-surface;

            border-top: 0.15rem solid $color-primary;
        }

        .little {
            bottom: 0;
            z-index: 5;
            display: flex;

            .nav-tile {
                width: $aside-side;
            }
        }

        .extended {
            bottom: $aside-side;
            z-index: 4;

            .nav-tile {
                display: flex;

                &-title {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    font-size: 1.5rem;
                    margin-left: 0.5rem;
                }
            }
        }

        .activatable {
            transition: background 0.3s, color 0.3s;

            &:hover {
                background: rgba($color-primary, 0.2);
            }

            &.active {
                background: $color-primary;
                color: $color-surface;

                --icon-component-color: #{$color-surface};
            }
        }

        .icon-container {
            width: $aside-side;
            height: $aside-side;
            display: flex;
            justify-content: center;
            align-items: center;

            font-size: calc(#{$aside-side} * 0.667);
        }

        a {
            text-decoration: none;
            color: inherit;

            &:link,
            &:visited,
            &:focus,
            &:hover {
                color: inherit;
            }
        }

        .trigger {
            svg {
                transition: 0.3s;
            }

            &:hover {
                cursor: pointer;
            }

            &.active svg {
                transform: rotate(180deg);
            }
        }
    }

    main {
        padding-bottom: $aside-side;
    }

    @media all and (min-aspect-ratio: 7 / 5) {
        :root {
            font-size: calc(0.5vw + 0.5vh + 10px);
        }
    }
</style>
