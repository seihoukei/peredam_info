<script>
    import SystemShortInfo from "./SystemShortInfo.svelte"
    import SystemMain from "./SystemMain.svelte"
    import appState from "../../../stores/app-state.js"

    export let systems = []

    $: system_id = $appState.system_id

    $: if (system_id !== null && !systems.find(item => +item.id === system_id))
        appState.setSystemId(null, appState.UPDATE_ADDRESS.REPLACE)

</script>

{#each systems as system (system.id)}
    {#if system_id === null || system_id === +system.id}
        <SystemShortInfo {system}/>
    {/if}
    {#if system_id === +system.id}
        <SystemMain on:remove {system}/>
    {/if}
{/each}
