<input placeholder={rt}
bind:value={placeholder}/>

<style lang="scss">
    input{
        background-color:aqua;
        border-radius: 50px;
        border-width:3px ;
        border-color: blue;
        border-style:inset;
        padding:8px;
        margin: 6px auto;
        display: block;
    }
</style>
<script>
    export let placeholder;
    export let rt;
</script>