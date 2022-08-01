<script>
    const texts = {
        "E-MAIL": "E-mail",
        "PHONE": "Оператор",
        "PHONE_AUTO": "Автооветчик",
        "SMS": "SMS",
        "SITE": "Сайт",
    }

    export let type

    $: text = texts[type] ?? "?"
</script>

<button on:click>{text}</button>
