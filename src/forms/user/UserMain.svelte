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

    export let user = {
        systems : []
    }

    let systems = Systems.sortByDate(user.systems)
    $: user.systems = Systems.sortByDate(systems)
    $: if ($appState.page === "") {
        if ($appState.user_provider_id)
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

    {#if $appState.page === 'read'}
        <ProviderReader />
    {:else}
        <UserMenu username={$appState.user_name}/>
        {#if $appState.page === 'add'}
            <AddSystem on:add={add}/>
        {:else}
            <SelectSystem {systems} on:remove={remove}/>
            {#if $appState.system_id === null}
                <button on:click={toAdd} transition:slide>＋ Добавить систему</button>
            {/if}

        {/if}
    {/if}

</div>
