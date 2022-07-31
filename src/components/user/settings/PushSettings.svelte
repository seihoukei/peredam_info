<script>
    const supported = ("serviceWorker" in navigator) && ("PushManager" in window)

</script>

{#if supported}
    <div class="centered flex">
        Состояние пуш-уведомлений:
        <button>Подписаться</button>
    </div>
{/if}
