<script>
    import fillTemplate from "../../../../utility/template.js"
    import MethodDetail from "./MethodDetail.svelte"
    import {slide} from "svelte/transition"

    export let method
    export let values

    $: message = fillTemplate(method.message, values)
    $: subject = fillTemplate(method.subject, values)
    $: comment = fillTemplate(method.comment, values)
    $: link = `mailto:${method.address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

</script>

<div class="spacy-below flex" transition:slide>
    <MethodDetail name="Способ">Отправка E-mail на электронный адрес</MethodDetail>
    <MethodDetail name="Адрес"><a href={link} target="_blank" rel="noopener noreferrer">{method.address}</a></MethodDetail>
    <MethodDetail name="Тема">
        <span class:empty={subject===""}>
            {subject === "" ? "< оставить пустой >" : subject}
        </span>
    </MethodDetail>
    <MethodDetail name="Сообщение">
        <span class:empty={message===""}>
            {message === "" ? "< оставить пустым >" : message}
        </span>
    </MethodDetail>
    {#if comment !== ""}
        <MethodDetail name="Примечание">{comment}</MethodDetail>
    {/if}
    <br>
    <MethodDetail name="Подсказка">Нажмите на ссылку в поле "Адрес" для отправки письма с вашего адреса.</MethodDetail>
</div>

<style>
    span.empty {
        opacity: 50%;
        font-style: italic;
    }
</style>
