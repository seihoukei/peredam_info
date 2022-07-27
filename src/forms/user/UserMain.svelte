<script>
    import TopLogo from "../common/TopLogo.svelte"
    import UserMenu from "../common/user-menu/UserMenu.svelte"
    import { fly, fade } from "svelte/transition"
    import {dialogFlyUp} from "../../utility/transitions.js"
    import SelectSystem from "./systems/SelectSystem.svelte"
    import AddSystem from "./systems/AddSystem.svelte"

    import Systems from "../../utility/systems.js"
    import Address from "../../utility/address.js"

    export let username = ""
    export let user = {
        systems : []
    }

    let current = user.systems.find(system => system.id === +Address.getPart(2, `user`, `system`)) ?? null
    let adding = false

    let systems = Systems.sortByDate(user.systems)
    $: user.systems = Systems.sortByDate(systems)

    $: selecting = !current && !adding
//    $: savingUser = syncUser($token, user)

    function add({detail:system}) {
        systems = [
            ...systems,
            system
        ]
    }

    function remove({detail:id}) {
        systems = systems.filter(x => x.id !== id)
    }
</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">Выбор системы: {JSON.stringify(current, null, 1)}</pre>
{/if}

<div class="centered top-central wrapper flex" in:fade out:fly={dialogFlyUp}>
    <TopLogo />
    <UserMenu {username}/>

    {#if adding}
        <AddSystem bind:adding on:add={add}/>
    {:else}
        <SelectSystem bind:systems={systems} bind:current bind:adding on:remove={remove}/>
    {/if}
</div>
