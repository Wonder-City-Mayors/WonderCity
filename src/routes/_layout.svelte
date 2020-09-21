<style global lang="sass">
  @font-face
    font-family: defaultFont
    font-weight: 400
    font-style: normal
    src: url('/fonts/Bellota-Regular.ttf')

  @font-face
    font-family: defaultFont
    font-weight: 700
    font-style: normal
    src: url('/fonts/Bellota-Bold.ttf')

  @font-face
    font-family: defaultFont
    font-weight: 400
    font-style: italic
    src: url('/fonts/Bellota-Italic.ttf')

  @font-face
    font-family: defaultFont
    font-weight: 700
    font-style: italic
    src: url('/fonts/Bellota-BoldItalic.ttf')

  *
    margin: 0
    padding: 0
    border: 0
    outline: 0
    vertical-align: baseline
    background: transparent
    z-index: 0
    box-sizing: border-box

  html
    font-size: calc(1vw + 2vh)
    font-family: defaultFont, serif
    height: 100%

  body
    height: 100%

  @media all and (orientation: landscape)
    html
      font-size: calc(1vw + 1vh)
</style>

<main>
  <slot />
</main>
