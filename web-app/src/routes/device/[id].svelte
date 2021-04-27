<script context="module" lang="ts">
    import { getPreloadApiResponse } from "utils/requests";

    export async function preload(page, session) {
        if (session.user.isAuthenticated) {
            if (
                await getPreloadApiResponse(
                    session.apiUrl + "/device/isMine",
                    {
                        deviceId: page.params.id,
                    },
                    this
                )
            )
                return {};
        }

        this.error(404, "Not found");
    }
</script>

<script lang="ts">
    import { getApiResponse } from "utils/requests";
    import { stores } from "@sapper/app";
    import { onMount } from "svelte";

    const { page, session } = stores();

    onMount(() => {
        getApiResponse(
            $session.apiUrl + "/value/stats",
            {
                begin: new Date(Date.now() - 20000000).toISOString(),
                deviceId: $page.params.id,
                parts: 20,
            },
            true
        ).then(console.log);
    });
</script>

<h1>Hello #{$page.params.id}</h1>
