<script>
    import { fly, fade } from "svelte/transition"
    import {dialogFlyDown} from "../utility/transitions.js"
    import TopLogo from "./TopLogo.svelte"

    const hour = new Date().getHours()

    const MORNING_HOUR = 6
    const DAY_HOUR = 10
    const EVENING_HOUR = 18
    const NIGHT_HOUR = 22

    const isNight = NIGHT_HOUR <= hour || hour < MORNING_HOUR
    const isMorning = MORNING_HOUR <= hour && hour < DAY_HOUR
    const isDay = DAY_HOUR <= hour && hour < EVENING_HOUR
    const isEvening = EVENING_HOUR <= hour && hour < NIGHT_HOUR
</script>

<div class="top-central centered large flex" in:fade out:fly={dialogFlyDown}>
    <TopLogo />

    {#if isNight}
        Доброй ночи!
    {:else if isMorning}
        Доброе утро!
    {:else if isDay}
        Добрый день!
    {:else if isEvening}
        Добрый вечер!
    {/if}
</div>
