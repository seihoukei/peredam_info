<script>
    import SystemShortInfo from "./SystemShortInfo.svelte"
    import SystemMain from "./SystemMain.svelte"
    import {slide} from "svelte/transition"
    import {createEventDispatcher} from "svelte"

    export let systems = []
    export let current = null
    export let adding = false

    function setSystem(system) {
        if (current === system)
            current = null
        else
            current = system
    }

    function addSystem() {
        adding = true
    }
</script>

{#each systems as system (system)}
    {#if !current || system === current}
        <SystemShortInfo bind:system current={current === system} on:click={()=>setSystem(system)}/>
    {/if}
{/each}
<SystemMain bind:system={current} on:remove />
{#if !current}
    <button on:click={addSystem} transition:slide>＋ Добавить систему</button>
{/if}
