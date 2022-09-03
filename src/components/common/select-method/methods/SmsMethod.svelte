<script>
    import MethodDetail from "components/common/select-method/methods/MethodDetail.svelte"

    import {slide} from "svelte/transition"

    import Values from "utility/values.js"

    export let method
    export let valuesToSubmit

    $: message = Values.fillTemplate(method.message, valuesToSubmit)
    $: comment = Values.fillTemplate(method.comment, valuesToSubmit)

    $: link = `sms:${method.number}?body=${encodeURIComponent(message)}`

</script>

<div class="spacy-below flex" transition:slide>
    <MethodDetail name="Способ">
        Отправка СМС-сообщения
    </MethodDetail>

    <MethodDetail name="Номер">
        <a href={link}>{method.number}</a>
    </MethodDetail>

    <MethodDetail name="Сообщение">{message}</MethodDetail>

    {#if comment !== ""}
        <MethodDetail name="Примечание">{comment}</MethodDetail>
    {/if}

    <br>
    <MethodDetail name="Подсказка">
        Нажмите на ссылку в поле "Номер" для отправки сообщения с вашего устройства, или
        отправьте указанное собщение на указанный номер вручную.
    </MethodDetail>
</div>
