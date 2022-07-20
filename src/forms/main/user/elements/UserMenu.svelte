<script>
    import SetCodeButton from "./SetCodeButton.svelte"
    import LogoutButton from "./LogoutButton.svelte"
    import { fly } from "svelte/transition"
    import clickOutside from "../../../../utility/events/clickOutside.js"

    let showMenu = false

    const toggleMenu = () => {
        showMenu = !showMenu
    }

    const hideMenu = () => {
        showMenu = false
    }
</script>

<div class="menu" use:clickOutside on:click_outside={hideMenu}>
    <button on:click={toggleMenu}>☰</button>
    {#if showMenu}
        <div class="items" transition:fly={{x:-200}}>
            <SetCodeButton />
            <LogoutButton />
        </div>
    {/if}
</div>

<style>
    div.menu {
        position : absolute;
        left : 0;
        top : 0;
    }
    div.items {
        display : flex;
        flex-direction: column;
        padding : var(--2u) 0;
        row-gap: var(--2u);
    }
</style>
