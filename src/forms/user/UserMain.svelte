<script>
    import TopLogo from "../TopLogo.svelte"
    import UserMenu from "./elements/UserMenu.svelte"
    import { fly, fade } from "svelte/transition"
    import {dialogFlyUp} from "../../utility/transitions.js"
    import SelectSystem from "./systems/SelectSystem.svelte"
    import AddSystem from "./systems/AddSystem.svelte"

    import syncUser from "../../utility/sync-user.js"
    import Systems from "../../utility/systems.js"
    import token from "../../stores/token.js"

    export let username = ""
    export let user = {
        systems : []
    }

    let current = null
    let adding = false

    let systems = Systems.sortByDate(user.systems)
    $: user.systems = Systems.sortByDate(systems)


    $: selecting = !current && !adding
    $: savingUser = syncUser($token, user)

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">Выбор системы: {JSON.stringify(current, null, 1)}</pre>
{/if}

<div class="centered top-central wrapper flex" in:fade out:fly={dialogFlyUp}>
    <TopLogo />
    <UserMenu {username}/>

    {#if adding}
        <AddSystem bind:systems={systems} bind:adding />
    {:else}
        <SelectSystem bind:systems={systems} bind:current bind:adding />
    {/if}
</div>
