<script>
    import TopLogo from "components/common/TopLogo.svelte"
    import UserMenu from "components/common/user-menu/UserMenu.svelte"
    import SelectSystem from "components/user/systems/SelectSystem.svelte"
    import AddSystem from "components/user/systems/AddSystem.svelte"
    import ProviderReader from "components/user/provider/ProviderReader.svelte"
    import UserSettings from "components/user/settings/UserSettings.svelte"
    import SystemMain from "components/user/systems/SystemMain.svelte"

    import {fade, fly, slide} from "svelte/transition"

    import appState from "stores/app-state.js"

    import Systems from "utility/systems.js"
    import Transitions from "utility/transitions.js"

    export let user = {
        systems: [],
    }

    let systems = Systems.sortByDate(user.systems)
    $: user.systems = Systems.sortByDate(systems)

    $: username = $appState.username
    $: page = $appState.page
    $: user_provider_id = $appState.user_provider_id
    $: system_id = $appState.system_id

    $: system = user.systems.find(system => +system.id === system_id)

    $: if (page === "") {
        if (user_provider_id) {
            appState.setPage("read")
        } else {
            appState.setPage("user")
        }
    }

    function add({detail: system}) {
        systems = [
            ...systems,
            system,
        ]
        appState.setPage("user")
    }

    function remove({detail: id}) {
        systems = systems.filter(x => x.id !== id)
        appState.setSystemId(null)
    }

    function toAdd() {
        appState.setPage("add")
        appState.setSystemId(null, appState.UPDATE_ADDRESS.NO)
    }

    function toAnon() {
        appState.setPage("anon")
    }

</script>

<div class="centered top-central wrapper flex" in:fade out:fly={Transitions.dialogFlyUp}>
    <TopLogo/>

    {#if page === 'read'}
        <ProviderReader/>

    {:else}
        <UserMenu {username}/>

        {#if page === 'add'}
            <AddSystem on:add={add}/>

        {:else if page === 'conf'}
            <UserSettings/>

        {:else}
            <SelectSystem {systems}>
                <SystemMain on:remove={remove} bind:system/>
            </SelectSystem>

            {#if system_id === null}
                <div class="spaced centered flex" transition:slide>
                    <button on:click={toAdd}>＋ Добавить систему</button>
                    <button on:click={toAnon}>Передать без запоминания</button>
                </div>
            {/if}

        {/if}

    {/if}

</div>
