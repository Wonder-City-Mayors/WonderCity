<script context="module">
  export async function preload(page, session) {
    try {
      const devices = JSON.parse(
        (
          await (
            await this.fetch(session.apiUrl + "/devices/getReadouts", {
              credentials: "include",
            })
          ).json()
        ).response
      );

      return {
        devices,
      };
    } catch (e) {
      console.log(e);
      this.redirect("/auth");
    }
  }
</script>

<script>
  import TransitionWrapper from "../components/TransitionWrapper.svelte";

  export let devices;

  console.log(devices);
</script>

<svelte:head>
  <title>Отслеживание показаний • WonderCity Reborn</title>
</svelte:head>

<TransitionWrapper>
  <h1>monitoring</h1>
</TransitionWrapper>
