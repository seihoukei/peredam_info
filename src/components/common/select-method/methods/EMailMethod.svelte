<script>
    import MethodDetail from "components/common/select-method/methods/MethodDetail.svelte"

    import {slide} from "svelte/transition"

    import Values from "utility/values.js"

    export let method
    export let valuesToSubmit

    $: message = Values.fillTemplate(method.message, valuesToSubmit)
    $: subject = Values.fillTemplate(method.subject, valuesToSubmit)
    $: comment = Values.fillTemplate(method.comment, valuesToSubmit)

    $: link = `mailto:${
        method.address
    }?subject=${
        encodeURIComponent(subject)
    }&body=${
        encodeURIComponent(message)
    }`

</script>

<div class="spacy-below flex" transition:slide>
    <MethodDetail name="Способ">
        Отправка E-mail на электронный адрес
    </MethodDetail>

    <MethodDetail name="Адрес">
        <a href={link}
           rel="noopener noreferrer"
           target="_blank">{method.address}</a>

    </MethodDetail>

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
    <MethodDetail name="Подсказка">
        Нажмите на ссылку в поле "Адрес" для отправки письма с вашего устройства.
    </MethodDetail>
</div>

<style>
    span.empty {
        opacity: 50%;
        font-style: italic;
    }
</style>
