<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    export default {
        name: 'App'
    }

</script>

<style>
    html {
        height: 100%;
    }

    body {
        margin: 0;
        height: 100%;
        background: #fcfcfc;
    }
    
    hr {
        display: block;
        height: 1px;
        border: 0;
        border-top: 1px solid #ddd;
        margin: 1em 0;
        padding: 0;
    }
    
    h3 {
        font-weight: 300;
    }

    a {
        text-decoration: none;
        color: #C33;
        cursor: pointer;
    }

    a:visited {
        color: #C33;
    }

    .cursor {
        cursor: pointer;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    .button,
    button {
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
        height: 35px;
        font-size: 14px;
        line-height: 14px;
        background-color: rgba(0, 0, 0, .05);
        /*        #35a;*/
        border: 1px solid transparent;
        color: #666;
        padding: 10px;
        margin: 8px 0;
        border-radius: 5px;
        display: inline-block;
    }

    .page-container {
        padding-left: calc(100vw - 100%);
        max-width: 950px;
        margin: auto;
        display: flex;
    }

    .page {
        padding: 11px;
        box-sizing: border-box;
        width: 100%;
        position: relative;
    }
    
    @media only screen and (max-width: 950px) {
    #nav-container {
        padding-left: 8px;
    }
    .page-container {
        padding-left: 0;
    }
}

</style>
