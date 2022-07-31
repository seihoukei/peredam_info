<script>
    import LogoutButton from "./LogoutButton.svelte"
    import {slide} from "svelte/transition"
    import clickOutside from "../../../events/click-outside.js"

    export let username

    let showMenu = false

    function toggleMenu() {
        showMenu = !showMenu
    }

    function hideMenu() {
        showMenu = false
    }
</script>

<div class="flex spacy-below" on:click_outside={hideMenu} use:clickOutside>
    <div class="row-flex">
        <button on:click={toggleMenu}>☰</button>
        <span class="large username">{username}</span>
    </div>
    {#if showMenu}
        <div class="spaced flex" transition:slide on:click={hideMenu}>
            <!--
                        <PageButton page="user">Управление показаниями</PageButton>
                        <PageButton page="conf">Настройки уведомлений</PageButton>
            -->
            <LogoutButton/>
        </div>
    {/if}
</div>
