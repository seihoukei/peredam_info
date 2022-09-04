<script>
    import LogoutButton from "components/common/user-menu/LogoutButton.svelte"
    import PageButton from "components/common/user-menu/PageButton.svelte"

    import {slide} from "svelte/transition"

    import clickOutside from "events/click-outside.js"

    export let display_name
    export let offline = false

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
        {#if offline}
            <button on:click={() => location.reload()}>↻</button>
        {:else}
            <button on:click={toggleMenu}>☰</button>
        {/if}
        <span class="large username">{display_name}</span>

    </div>

    {#if showMenu}
        <div class="spaced centered flex" transition:slide on:click={hideMenu}>
            <PageButton page="user">
                Управление показаниями
            </PageButton>

            <PageButton page="conf_user">
                Настройки пользователя
            </PageButton>

            <PageButton page="conf_notifications">
                Настройки уведомлений
            </PageButton>

            <LogoutButton/>

        </div>

    {/if}

</div>
