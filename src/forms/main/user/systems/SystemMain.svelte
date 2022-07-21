<script>
    import library from "../../../../stores/library.js"
    import {slide} from "svelte/transition"
    import StaticDetail from "./elements/StaticDetail.svelte"
    import VariableDetail from "./elements/VariableDetail.svelte"

    export let system = {}
    let input = {}

    const getProvider = (library, system) => {
        input = {}
        if (system === null)
            return null

        return library.providers[system.provider] ?? null
    }

    $: provider = getProvider($library, system)
</script>

{#if system !== null}
    {#if provider !== null}
        <div class="system">
            <StaticDetail name="Поставщик" value={provider.name} />
            <StaticDetail name="Период" value={provider.period} />
            {#each Object.entries(provider.values) as [id, value] (id)}
                {#if value.constant}
                    <StaticDetail name={value.name} value={system.values[id]} />
                {:else}
                    <VariableDetail name={value.name} value={input[id]} type={value.type}/>
                {/if}
            {/each}
        </div>
    {:else}
        <span class="error" transition:slide>Неизвестный поставщик услуг</span>
    {/if}
{/if}
