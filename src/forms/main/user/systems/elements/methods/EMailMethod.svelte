<script>
    import fillTemplate from "../../../../../../utility/template.js"
    import MethodDetail from "../MethodDetail.svelte"
    import {slide} from "svelte/transition"

    export let method
    export let values

    $: message = fillTemplate(method.template, values)
</script>

<div class="method" transition:slide>
    <MethodDetail name="Способ">Отправка E-mail на адрес</MethodDetail>
    <MethodDetail name="Адрес"><a href={`mailto:${method.address}?body=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">{method.address}</a></MethodDetail>
    <MethodDetail name="Сообщение">{message}</MethodDetail>
    {#if method.comment}
        <MethodDetail name="Примечание">{fillTemplate(method.comment, values)}</MethodDetail>
    {/if}
    <br>
    <MethodDetail name="Подсказка:">Нажмите на ссылку в поле "Адрес" для отправки письма с вашего адреса. После успешной отправки письма нажмите "Завершить".</MethodDetail>
</div>
