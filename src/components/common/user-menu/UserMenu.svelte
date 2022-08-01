<script>
    import LogoutButton from "components/common/user-menu/LogoutButton.svelte"
    import PageButton from "components/common/user-menu/PageButton.svelte"

    import {slide} from "svelte/transition"

    import clickOutside from "events/click-outside.js"

    export let username

    let showMenu = false

    function toggleMenu() {
        showMenu = !showMenu
    }

    function hideMenu() {
        showMenu = false
    }
</script>

<div class="centered spacy-below flex" use:clickOutside on:click_outside={hideMenu}>
    <div class="spacy-below row-flex">
        <button on:click={toggleMenu}>☰</button>
        <span class="large username">{username}</span>

    </div>

    {#if showMenu}
        <div class="spaced centered flex" transition:slide on:click={hideMenu}>
<!--
            <PageButton page="user">
                Управление показаниями
            </PageButton>

            <PageButton page="conf">
                Настройки уведомлений
            </PageButton>
-->

            <LogoutButton/>

        </div>

    {/if}

</div>
