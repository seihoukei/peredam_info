<script>
    import SystemShortInfo from "./SystemShortInfo.svelte"
    import appState from "../../../stores/app-state.js"
    import {onMount} from "svelte"
    import ScrollWindow from "../../../utility/scroll-window.js"

    export let systems = []

    $: system_id = $appState.system_id

    $: if (system_id !== null && !systems.find(item => +item.id === system_id))
        appState.setSystemId(null, appState.UPDATE_ADDRESS.REPLACE)

    $: if (system_id !== null) {
        ScrollWindow.to(180)
    }
</script>

{#each systems as system (system.id)}
    {#if system_id === null || system_id === +system.id}
        <SystemShortInfo {system}/>
    {/if}
    {#if system_id === +system.id}
        <slot />
    {/if}
{/each}
