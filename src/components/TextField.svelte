<input placeholder={rt}
bind:value={value}/>

<style>
    input{
        background-color:aqua;
        border-radius: 50px;
        border-width:5px ;
        border-color: blue;
        border-style:inset;
    }
</style>
<script>
    export let value;
    export let rt;
</script>