<script lang="ts">
    export let caption: string
    let title: string

    if (caption) {
        title = `${caption} • Wonder City`
    } else {
        title = "Wonder City"
    }
</script>

<svelte:head>
    <title>
        {title}
    </title>
</svelte:head>
