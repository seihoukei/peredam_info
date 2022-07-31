<script>
    import reading from "../../stores/reading.js"

    function help() {
        reading.set(true)
    }
</script>

<div class="relative">
    <img alt="logo" class="logo" src="/resources/images/top.png">
    <button class="info" on:click={help}>i</button>
</div>

<style>
    img.logo {
        padding: 30px 0;
        height: 70px;
    }

    button {
        position: absolute;
        top: 40px;
        right: -60px;
        width: 50px;
        height: 50px;
        border-radius: 25px;
        font: 35px bold courier;
    }
</style>
