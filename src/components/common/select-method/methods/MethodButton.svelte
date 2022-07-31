<script>
    export let type

    const texts = {
        "E-MAIL": "E-mail",
        "PHONE": "Оператор",
        "PHONE_AUTO": "Автооветчик",
        "SMS": "SMS",
        "SITE": "Сайт",
    }

    $: text = texts[type] ?? "?"
</script>

<button on:click>{text}</button>
