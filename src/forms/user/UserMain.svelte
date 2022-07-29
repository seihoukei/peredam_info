<script>
    import TopLogo from "../common/TopLogo.svelte"
    import UserMenu from "../common/user-menu/UserMenu.svelte"
    import { fly, fade, slide } from "svelte/transition"
    import {dialogFlyUp} from "../../utility/transitions.js"
    import SelectSystem from "./systems/SelectSystem.svelte"
    import AddSystem from "./systems/AddSystem.svelte"

    import Systems from "../../utility/systems.js"
    import appState from "../../stores/app-state.js"
    import ProviderReader from "./provider/ProviderReader.svelte"
    import UserSettings from "./settings/UserSettings.svelte"
    import SystemMain from "./systems/SystemMain.svelte"

    export let user = {
        systems : []
    }

    let systems = Systems.sortByDate(user.systems)
    $: user.systems = Systems.sortByDate(systems)

    $: username = $appState.username
    $: page = $appState.page
    $: user_provider_id = $appState.user_provider_id
    $: system_id = $appState.system_id
    $: system = user.systems.find(system => +system.id === system_id)

    $: if (page === "") {
        if (user_provider_id)
            appState.setPage("read")
        else
            appState.setPage("user")
    }


    function add({detail:system}) {
        systems = [
            ...systems,
            system
        ]
        appState.setPage("user")
    }

    function remove({detail:id}) {
        systems = systems.filter(x => x.id !== id)
        appState.setSystemId(null)
    }

    function toAdd() {
        appState.setPage("add")
        appState.setSystemId(null, appState.UPDATE_ADDRESS.NO)
    }
</script>

<div class="centered top-central wrapper flex" in:fade out:fly={dialogFlyUp}>
    <TopLogo />

    {#if page === 'read'}
        <ProviderReader />
    {:else}
        <UserMenu {username}/>
        {#if page === 'add'}
            <AddSystem on:add={add}/>

        {:else if page === 'conf'}
            <UserSettings />

        {:else}
            <SelectSystem {systems}>
                <SystemMain on:remove={remove} {system}/>
            </SelectSystem>

            {#if system_id === null}
                <button on:click={toAdd} transition:slide>＋ Добавить систему</button>
            {/if}

        {/if}
    {/if}

</div>
