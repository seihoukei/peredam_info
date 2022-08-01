<script>
    import {slide} from "svelte/transition"

    import library from "stores/library.js"
    import appState from "stores/app-state.js"

    $: city_id = $appState.city_id
    $: provider_id = $appState.provider_id

    function switchCurrent(value) {
        if (provider_id === +value) {
            appState.setProviderId(null)
        } else {
            appState.setProviderId(+value)
        }
    }

</script>

{#if city_id !== null}
    {#if Object.keys(library.cities[city_id].providers).length}
        <div class="centered flex">
            {#if provider_id === null}
                <span class="large spacy-below important" transition:slide>
                    Выберите поставщика услуг:
                </span>

            {:else}
                <span transition:slide>
                    Поставщик услуг:
                </span>

            {/if}

            {#each Object.entries(library.cities[city_id].providers) as [id, provider](id)}
                {#if !provider_id || provider_id === +id}
                    <div class=" centered flex" transition:slide>
                        <button on:click={()=>switchCurrent(id)}
                                class="large">
                                {provider_id === +id ? "◀" : ""}
                                {provider.name}
                        </button>

                        <span class="spacy-below">{provider.type}</span>

                    </div>

                {/if}

            {/each}

        </div>

    {:else}
        <span transition:slide>
            Здесь пока ничего нет
        </span>

    {/if}

{/if}
