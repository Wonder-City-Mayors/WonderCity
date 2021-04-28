<script context="module">
    export async function preload(page, session) {
        if (!session.user.isAuthenticated) {
            await this.redirect(301, "/auth");
        }
    }
</script>

<script lang="ts">
    import { stores } from "@sapper/app";
    import { onDestroy, setContext } from "svelte";
    import { readable } from "svelte/store";

    import type { Socket } from "socket.io-client";

    let socket: Socket;

    const { session, page } = stores();

    const socketStore = readable<Socket | null>(null, (set) => {
        Promise.all([import("socket.io-client"), import("url-parse")]).then(
            ([socketio, url]) => {
                try {
                    const apiUrl = new url.default($session.apiUrl);

                    socket = socketio.io(apiUrl.origin, {
                        path:
                            apiUrl.pathname +
                            (apiUrl.pathname[apiUrl.pathname.length - 1] === "/"
                                ? ""
                                : "/") +
                            "socket.io/",
                    });
                } catch (e) {
                    socket = socketio.io($page.host, {
                        path: $session.apiUrl + "/socket.io/",
                    });
                }

                set(socket);
            }
        );

        return () => 0;
    });

    setContext("socket", socketStore);

    onDestroy(() => {
        if ($socketStore) {
            $socketStore.disconnect();
        }
    });
</script>

<slot />
