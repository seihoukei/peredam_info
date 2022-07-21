<script>
    import SystemShortInfo from "./elements/SystemShortInfo.svelte"
    import SystemMain from "./SystemMain.svelte"
    import {slide} from "svelte/transition"

    export let systems = []
    export let current = null
    export let adding = false

    const setSystem = (system) => {
        if (current === system)
            current = null
        else
            current = system
    }

    const addSystem = () => {
        adding = true
    }
</script>

{#each systems as system (system)}
    {#if !current || system === current}
        <SystemShortInfo {system} on:click={()=>setSystem(system)}/>
    {/if}
{/each}
<SystemMain system={current} />
{#if !current}
    <button on:click={addSystem} transition:slide>Добавить систему</button>
{/if}
