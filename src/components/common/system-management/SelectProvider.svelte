<script>
    import {slide} from "svelte/transition"

    import appState from "stores/app-state.js"

    export let city = {
        providers:{}
    }

    $: provider_id = $appState.provider_id

    function switchCurrent(value) {
        if (provider_id === +value) {
            appState.setProviderId(null)
        } else {
            appState.setProviderId(+value)
        }
    }

</script>

<div class="centered flex">
    {#if city !== null && Object.keys(city.providers).length}
        {#if provider_id === null}
            <span class="large spacy-below important" transition:slide|local>
                Выберите поставщика услуг:
            </span>

        {:else}
            <span transition:slide|local>
                Поставщик услуг:
            </span>

        {/if}

        {#each Object.entries(city.providers) as [id, provider](id)}
            {#if !provider_id || provider_id === +id}
                <div class=" centered flex" transition:slide|local>
                    <button on:click={()=>switchCurrent(id)}
                            class="large">
                            {provider_id === +id ? "◀" : ""}
                            {provider.name}
                    </button>

                    <span class="spacy-below">{provider.type}</span>

                </div>

            {/if}

            {#if provider_id === +id}
                <div transition:slide|local>
                    <slot/>
                </div>
            {/if}

        {/each}

    {:else}
        <span transition:slide|local>
            Здесь пока ничего нет
        </span>

    {/if}
</div>
