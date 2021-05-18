<script lang="ts">
    import { stores } from "@sapper/app";
    import Title from "components/Title.svelte";
    import Input from "components/Input.svelte";
    import Btn from "components/Btn.svelte";

    import { postApi } from "utils/requests";

    let deviceId;

    const { session } = stores();

    function addDevice() {
        postApi(
            $session.apiUrl + "/user/addDevice",
            {
                id: deviceId,
            },
            true
        ).then(
            (gut) => {
                alert("Всё готово!");
            },
            (bad) => {
                alert("Ты чё?");
            }
        );
    }
</script>

<Title caption="Датчики" />

<Input bind:value={deviceId} placeholder="Идентификатор датчика" />

<Btn on:click={addDevice}>Нажми меня</Btn>

<style>
</style>
