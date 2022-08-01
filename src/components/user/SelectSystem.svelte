<script>
    import SystemShortInfo from "components/user/SystemShortInfo.svelte"

    import { slide} from "svelte/transition"

    import appState from "stores/app-state"

    import ScrollWindow from "utility/scroll-window"

    export let systems = []

    $: system_id = $appState.system_id

    $: if (system_id !== null && !systems.find(item => +item.id === system_id)) {
        appState.setSystemId(null, appState.UPDATE_ADDRESS.REPLACE)
    }

    $: if (system_id !== null) {
        ScrollWindow.to(180)
    }

</script>

{#if system_id === null}
    <div class="large important spacy-below center-text" transition:slide>
        Выберите систему
    </div>
{/if}

{#each systems as system (system.id)}
    {#if system_id === null || system_id === +system.id}
        <SystemShortInfo {system}/>
    {/if}

    {#if system_id === +system.id}
        <slot/>
    {/if}

{/each}
