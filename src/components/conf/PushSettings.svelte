<script>
    import {slide} from "svelte/transition"

    const supported = ("serviceWorker" in navigator) && ("PushManager" in window)

</script>

{#if supported}
    <div class="centered flex" transition:slide|local>
        Состояние пуш-уведомлений:
        <button>Подписаться</button>
    </div>
{/if}
