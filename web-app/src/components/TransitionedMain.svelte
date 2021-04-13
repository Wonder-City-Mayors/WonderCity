<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<main transition:fade>
    <slot />
</main>

<style>
    main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
</style>
