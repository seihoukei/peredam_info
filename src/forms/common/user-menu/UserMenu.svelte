<script>
    import LogoutButton from "./LogoutButton.svelte"
    import { fly } from "svelte/transition"
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

<div class="flex spacy-below" use:clickOutside on:click_outside={hideMenu}>
    <div class="row-flex">
        <button on:click={toggleMenu}>☰</button>
        <span class="large username">{username}</span>
    </div>
    {#if showMenu}
        <div class="flex items" transition:fly={{x:-200}}>
            <LogoutButton />
        </div>
    {/if}
</div>

<style>
    div.items {
        position : absolute;
        padding : 20px 0;
        row-gap: 20px;
    }
</style>
