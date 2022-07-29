<script>
    import {slide} from "svelte/transition"
    import library from "../../../stores/library.js"
    import appState from "../../../stores/app-state.js"
    import {onMount} from "svelte"

    $: city_id = $appState.city_id
    $: provider_id = $appState.provider_id

    function switchCurrent(value) {
        if (city_id === value)
            appState.setCityId(null)
        else
            appState.setCityId(value)
    }

    onMount(() => {
        if (city_id === null) {
            if (localStorage.defaultCity)
                appState.setCityId(+localStorage.defaultCity || null, appState.UPDATE_ADDRESS.REPLACE)
            else if (Object.keys(library.cities).length === 1)
                appState.setCityId(+Object.keys(library.cities)[0] || null, appState.UPDATE_ADDRESS.REPLACE)
        }
    })

</script>

{#if provider_id === null}
    <div class="centered flex" transition:slide>
        {#if city_id === null}
            <span class="large spacy-below important" transition:slide|local>Выберите город:</span>
        {:else}
            <span transition:slide|local>Город:</span>
        {/if}

        {#each Object.entries(library.cities) as [id, city] (id)}
            {#if city_id === null || city_id === +id}
                <button class="large spacy-below" on:click={()=>switchCurrent(+id)} transition:slide|local>
                    {city_id === +id ? "◀" : ""} {city.name}
                </button>
            {/if}
        {/each}
    </div>
{/if}
