<script>
    import fillTemplate from "../../../../../utility/template.js"
    import MethodDetail from "../MethodDetail.svelte"
    import {slide} from "svelte/transition"

    export let method
    export let values

    $: message = fillTemplate(method.message, values)
    $: comment = fillTemplate(method.comment, values)
    $: link = `sms:${method.number}?body=${encodeURIComponent(message)}`

</script>

<div class="spacy-below flex" transition:slide>
    <MethodDetail name="Способ">Отправка СМС-сообщения</MethodDetail>
    <MethodDetail name="Номер"><a href={link}>{method.number}</a></MethodDetail>
    <MethodDetail name="Сообщение">{message}</MethodDetail>
    {#if comment !== ""}
        <MethodDetail name="Примечание">{comment}</MethodDetail>
    {/if}
    <br>
    <MethodDetail name="Подсказка">Нажмите на ссылку в поле "Номер" для отправки сообщения с вашего устройства, или отправьте указанное собщение на указанный номер вручную. </MethodDetail>
</div>
