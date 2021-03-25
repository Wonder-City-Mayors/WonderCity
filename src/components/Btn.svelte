<button on:click>
    <slot />
</button>

<style>
    button {
        font-size: .75rem;
        display: block;
        text-align: center;
        height: 20px;
        width: 130px;
        margin: 3px auto;
        line-height: 50px;
        padding-left: 38px;
        position: relative;
        background: rgb(197, 231, 43);
        color: #b82ca0;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-radius: 5px;
        text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.5);
        filter: progid:DXImageTransform.Microsoft.dropshadow(OffX=0,OffY=1,Color=#ff123852,Positive=true);
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
        filter: progid:DXImageTransform.Microsoft.dropshadow(OffX=0,OffY=2,Color=#33000000,Positive=true);
    }

    a.button span {
        position: absolute;
        left: 0;
        width: 50px;
        background-color: rgba(0, 0, 0, 0.5);
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-right: 1px solid rgba(0, 0, 0, 0.15);
    }
    a.button:hover span,
    .button.active span {
        background: rgb(47, 226, 226);
        border-right: 1px solid rgb(46, 208, 219);
        color: #e09034;
    }
</style>
