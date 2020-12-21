<script>
  import TransitionWrapper from "TransitionWrapper.svelte";
  import Title from "Title.svelte";
</script>

<style>
#d{margin:auto;
width:10rem;}
  #f {
    border-radius: 30px 30px 30px 30px;
    background-color: #0bdb38;
    border-color: black;
  }
  #but {
    background-color: #2abfda;
    border-top: none;
    border-left: none;
    border-right: 1px solid rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    outline: none;
    
  }

  #but:hover {
    background-color: #d4e20c;
  }

  #but:active {
    background-color: #c22257;
    border-top: 1px solid rgba(0, 0, 0, 0.5);
    border-left: 1px solid rgba(0, 0, 0, 0.5);
    border-bottom: none;
    border-right: none;
  }
</style>

<TransitionWrapper>
  <div id="d">
  <input placeholder="Имя" id="f" />
  <button id="but">Нажми меня</button>
  <br />
  <input placeholder="Фамилия" id="f" />
  <button id="but">Нажми меня</button>
  <br />
  <input placeholder="Адрес" id="f" />
  <button id="but">Нажми меня</button>
  <br />
  <input placeholder="Электронная почта" id="f" />
  <button id="but">Нажми меня</button>
  <br />
  <input placeholder="Пароль" id="f" />
  <button id="but">Нажми меня</button>
  <br />
  <input placeholder="Подтверждение пароля" id="f" />
  <button id="but">Нажми меня</button>
  </div>
</TransitionWrapper>
