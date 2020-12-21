<script>
  import TransitionWrapper from "TransitionWrapper.svelte";
  import Title from "Title.svelte";
</script>

<style>
  #f{border-radius:30px 30px 30px 30px;
  margin-left:650px;
  background-color:#0bc2db;
  border-color:black;
  ;}
  #but{
  background-color:#caa777;
  border-top:none;
  border-left:none;
  border-right:1px solid rgba(0,0,0,0.5);
  border-bottom:1px solid rgba(0,0,0,0.5);
  outline:none;
  margin-left:650px;
  }

  #but:hover{
  background-color:#1dd9b3;
  }

  #but:active{
  background-color:#967c66;
  border-top:1px solid rgba(0,0,0,0.5);
  border-left:1px solid rgba(0,0,0,0.5);
  border-bottom:none;
  border-right:none;
  }
</style>

<TransitionWrapper>
<input placeholder="Имя" id="f">
  <br>
    <input placeholder="Фамилия" id="f">
    <br>
      <input placeholder="Адрес" id="f">
      <br>
        <input placeholder="Электронная почта" id="f">
        <br>
          <input placeholder="Пароль" id="f">
          <br>
            <input placeholder="Подтверждение пароля" id="f">
              <br>
              <button id="but">Нажми меня</button>
             </TransitionWrapper>
            