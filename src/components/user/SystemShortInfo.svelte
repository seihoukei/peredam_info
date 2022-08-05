<script>
    import library from "stores/library"
    import appState from "stores/app-state"

    import Period from "utility/period"

    export let system = {}

    let nextTime = ""

    $: system_id = $appState.system_id
    $: current = (system_id === +system.id)

    $: provider = system ? library.providers[system.provider_id] ?? null : null
    $: period = new Period(provider?.period)
    $: displayName = `${current ? "◀" : ""} ${provider?.type} (${system?.values?.ACCOUNT ?? ""})`
    $: nextTime = period.nextString(system?.last?.date)

    function switchCurrent() {
        if (current) {
            appState.setSystemId(null)
        } else {
            appState.setSystemId(+system.id)
        }
    }
</script>

{#if provider !== null}
    <div class="centered flex">
        <button class="large"
                on:click={switchCurrent}>{displayName}</button>

        <span class="next spacy-below">
            Передать {nextTime}
        </span>

    </div>

{/if}
