<script>
    import { fly, fade } from "svelte/transition"
    import {dialogFlyUp} from "../../../utility/transitions.js"
    import TopLogo from "../../login/elements/TopLogo.svelte"
    import SelectSystem from "./systems/SelectSystem.svelte"
    import AddSystem from "./systems/AddSystem.svelte"
    import UserMenu from "./elements/UserMenu.svelte"

    export let user = {
        systems : []
    }

    let systems = user.systems
    $: user.systems = systems

    let current = null
    let adding = false

    $: selecting = !current && !adding

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">Выбор системы{JSON.stringify(current, null, 1)}</pre>
{/if}


<div class="container" in:fade out:fly={dialogFlyUp}>
    <TopLogo />

    {#if adding}
        <AddSystem bind:systems={systems} bind:adding />
    {:else}
        <SelectSystem systems={systems} bind:current bind:adding />
    {/if}
    <UserMenu />
</div>

<style>
    .debug {
        color: var(--text-color);
        position: absolute;
        bottom : 0;
        left : 0;
        opacity: 0.2;
        font-size: 20px;
        pointer-events: none;
        z-index:100;
    }
</style>
