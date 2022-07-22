<script>
    import { fly, fade } from "svelte/transition"
    import {dialogFlyUp} from "../../../utility/transitions.js"
    import TopLogo from "../../login/elements/TopLogo.svelte"
    import SelectSystem from "./systems/SelectSystem.svelte"
    import AddSystem from "./systems/AddSystem.svelte"
    import UserMenu from "./elements/UserMenu.svelte"
    import library from "../../../stores/library.js"
    import Period from "../../../utility/period.js"

    import syncUser from "../../../utility/sync-user.js"

    export let user = {
        systems : []
    }
    export let token = null

    function sortByDate(systems) {
        const now = Date.now()
        const dateMap = new Map()
        systems.map(system => dateMap.set(system, new Period(library.providers[system.provider].period).next(system.last?.date)))
        return systems.sort((a, b) => {
            const aDate = dateMap.get(a)
            const bDate = dateMap.get(b)
            if (aDate.first < now && bDate.first < now) {
                return aDate.last - bDate.last
            } else if (aDate.first < now)
                return -1
            else if (bDate.first < now)
                return 1
            else
                return aDate.first - bDate.first || aDate.last - bDate.last
        })
    }

    let systems = sortByDate(user.systems)
    $: user.systems = sortByDate(systems)

    let current = null
    let adding = false

    $: selecting = !current && !adding

    $: savingUser = syncUser(token, user)

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">Выбор системы{JSON.stringify(current, null, 1)}</pre>
{/if}


<div class="container" in:fade out:fly={dialogFlyUp}>
    <TopLogo />

    {#if adding}
        <AddSystem bind:systems={systems} bind:adding />
    {:else}
        <SelectSystem bind:systems={systems} bind:current bind:adding />
    {/if}
    <UserMenu />
</div>

<style>
    .debug {
        color: var(--text-color);
        position: absolute;
        bottom : 0;
        left : 0;
        opacity: 0.2;
        font-size: 20px;
        pointer-events: none;
        z-index:100;
    }
</style>
