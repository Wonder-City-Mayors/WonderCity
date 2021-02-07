<script>
  import TransitionWrapper from "TransitionWrapper.svelte";
  import Title from "Title.svelte";

  import { getApiResponse } from "requests";

  let deviceId;
  let newName;
  let newLastName;
  let newEmail;
  let newPassword;

  function addDevice() {
    getApiResponse('/api/users/addDevice', {
      id: deviceId
    }, true).then(gut => {
      alert('Всё готово!');
    }, bad => {
      alert('Ты чё?');
    });
  }

  function changeName() {
    getApiResponse('/api/users/addName', {
      name: newName
    }, true).then(gut => {
      alert('Всё готово!');
    }, bad => {
      alert('Пипец.');
    });
  }

  /**
   * Обработчик клика на кнопку, который отправляет запрос для
   * смены фамилии
   */
  function changeLastName() {
    getApiResponse("/api/users/changeLastName", {
	  lastName: newLastName
	  }, true).then(gut => {
	    alert("НУ вроде ОК");
    }, bad => {
	  alert("Неа, не сменил");
	  });
  }

  /**
   * Обработчик клика на кнопку, который отправляет запрос для
   * смены электронной почты
   */
  function changeEmail() {
    getApiResponse("/api/users/changeEmail", {
      email: newemail
    }, true).then(gut => {
       alert("НЕ ссы, спама не будет");
    }, bad => {
      alert("Старая осталась");
    });
  }

  /**
   * Обработчик клика на кнопку, который отправляет запрос для
   * смены пароля
   */
  function changePassword() {
    getApiResponse("/api/users/changePassword", {
      password: newPassword
    }, true).then(gut => {
      alert("Новый не забудь как старый");
    }, bad => {
      alert("Старый вспоминай");
    });
  }
</script>

<style>
  #d {
    margin: auto;
    width: 10rem;
  }
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

<Title caption="Профиль" />

<TransitionWrapper>
  <div id="d">
    <input bind:value={deviceId} placeholder="Идентификатор датчика" id="f" />
    <button id="but" on:click={addDevice}>Нажми меня</button>
    <input bind:value={newName} placeholder="Имя" id="f" />
    <button id="but" on:click={changeName}>Нажми меня</button>
    <br />
    <input bind:value={newLastName} placeholder="Фамилия" id="f" />
    <button id="but" on:click={changeLastName}>Нажми меня</button>
    <br />
    <input bind:value={newEmail} placeholder="Электронная почта" id="f" />
    <button id="but" on:click={changeEmail}>Нажми меня</button>
    <br />
    <input bind:value={newPassword} placeholder="Пароль" id="f" />
    <button id="but" on:click={changePassword}>Нажми меня</button>
    <br />
  </div>
</TransitionWrapper>
