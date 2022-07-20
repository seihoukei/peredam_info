<script>
    import SystemShortInfo from "./elements/SystemShortInfo.svelte"

    export let systems = []
    export let current = null
    export let adding = false

    const setSystem = (system) => {
        current = system
    }

    const addSystem = () => {
        adding = true
    }
</script>

{#each systems as system}
    <SystemShortInfo {system} on:click={()=>setSystem(system)}/>
{/each}
<button on:click={addSystem}>Добавить систему</button>
