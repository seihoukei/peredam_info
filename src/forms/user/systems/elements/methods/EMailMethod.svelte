<script>
    import fillTemplate from "../../../../../utility/template.js"
    import MethodDetail from "../MethodDetail.svelte"
    import {slide} from "svelte/transition"

    export let method
    export let values

    $: message = fillTemplate(method.template, values)
    $: comment = fillTemplate(method.comment, values)
    $: link = `mailto:${method.address}?body=${encodeURIComponent(message)}`

</script>

<div class="spacy-below flex" transition:slide>
    <MethodDetail name="Способ">Отправка E-mail на электронный адрес</MethodDetail>
    <MethodDetail name="Адрес"><a href={link} target="_blank" rel="noopener noreferrer">{method.address}</a></MethodDetail>
    <MethodDetail name="Сообщение">{message}</MethodDetail>
    {#if comment !== ""}
        <MethodDetail name="Примечание">{comment}</MethodDetail>
    {/if}
    <br>
    <MethodDetail name="Подсказка">Нажмите на ссылку в поле "Адрес" для отправки письма с вашего адреса. После успешной отправки письма нажмите "Завершить".</MethodDetail>
</div>
