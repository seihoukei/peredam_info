<script>
    import TopLogo from "components/common/TopLogo.svelte"
    import UserMenu from "components/common/user-menu/UserMenu.svelte"
    import SelectSystem from "components/user/SelectSystem.svelte"
    import AddSystem from "components/add/AddSystem.svelte"
    import ProviderReader from "components/read/ProviderReader.svelte"
    import UserSettings from "components/conf/UserSettings.svelte"
    import SystemMain from "components/user/sys/SystemMain.svelte"

    import {slide} from "svelte/transition"

    import appState from "stores/app-state.js"

    import Systems from "utility/systems.js"

    export let user = {
        systems: [],
        properties: {}
    }

    let systems = Systems.sortByDate(user.systems)
    $: user.systems = Systems.sortByDate(systems)
    $: localStorage.offlineSystems = btoa(JSON.stringify(user.systems))

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

<div class="centered top-central wrapper flex">
    <TopLogo/>

    {#if page === 'read'}
        <div transition:slide|local>
            <ProviderReader/>
        </div>

    {:else}
        <UserMenu {username} offline={user.offline}/>
        {#if user.offline}
            <div class="spacy-below center-text">
                Автономная работа.<br>
                Данные могут быть переданы в ручном режиме, но не будут отмечены в базе напоминаний и статистике.
            </div>
        {/if}

        {#if page === 'add' && !user.offline}
            <div transition:slide|local>
                <AddSystem on:add={add}/>
            </div>

        {:else if page === 'conf' && !user.offline}
            <div transition:slide|local>
                <UserSettings bind:userProperties={user.properties} />
            </div>

        {:else}
            <div class="centered flex" transition:slide|local>
                <SelectSystem {systems}>
                    <SystemMain on:remove={remove} bind:system offline={user.offline}/>
                </SelectSystem>

                {#if system_id === null}
                    <div class="spaced centered flex" transition:slide|local>
                        {#if !user.offline}
                        <button on:click={toAdd}>＋ Добавить систему</button>
                        {/if}
                        <button on:click={toAnon}>Передать без запоминания</button>
                    </div>
                {/if}

            </div>

        {/if}

    {/if}

</div>
