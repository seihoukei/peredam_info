<script>
    import {slide} from "svelte/transition"

    import library from "stores/library.js"
    import appState from "stores/app-state.js"

    let city_id = $appState.city_id

    if (city_id === null) {
        appState.setCityId(getDefaultCityId())
    }

    $: city_id = $appState.city_id
    $: provider_id = $appState.provider_id

    function getDefaultCityId() {
        if (localStorage.defaultCity)
            return +localStorage.defaultCity || null

        if (Object.keys(library.cities).length === 1)
            return +Object.keys(library.cities)[0] || null

        return null
    }

    function switchCurrent(value) {
        if (city_id === value) {
            appState.setCityId(null)
        } else {
            appState.setCityId(value)
        }
    }

</script>

<div class="centered flex">
    {#if provider_id === null}
        {#if city_id === null}
            <div class="large spacy-below important" transition:slide|local>
                Выберите город:
            </div>

        {:else}
            <div transition:slide|local>
                Город:
            </div>

        {/if}
    {/if}

    {#each Object.entries(library.cities) as [id, city] (id)}
        {#if (city_id === null || city_id === +id) && provider_id === null}
            <button on:click={()=>switchCurrent(+id)}
                    class="large spacy-below"
                    transition:slide|local>
                    {city_id === +id ? "◀" : ""}
                    {city.name}
            </button>
        {/if}

        {#if city_id === +id}
            <div transition:slide|local>
                <slot/>
            </div>
        {/if}

    {/each}

</div>
