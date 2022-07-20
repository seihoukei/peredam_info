<script>
    import { fly, fade } from "svelte/transition"
    import {dialogFlyUp} from "../../../utility/transitions.js"
    import TopLogo from "../../login/elements/TopLogo.svelte"
    import SelectSystem from "./systems/SelectSystem.svelte"
    import SystemMain from "./systems/SystemMain.svelte"
    import AddSystem from "./systems/AddSystem.svelte"
    import UserMenu from "./elements/UserMenu.svelte"

    export let user = {
        systems : []
    }

    let current = null
    let adding = false

    $: selecting = !current && !adding

</script>

<div class="container" in:fade out:fly={dialogFlyUp}>
    <TopLogo />

    {#if selecting}
        <SelectSystem systems={user.systems} bind:current bind:adding></SelectSystem>
    {:else if adding}
        <AddSystem bind:system={current} bind:adding/>
    {:else}
        <SystemMain bind:system={current} />
    {/if}
    <UserMenu />
</div>
