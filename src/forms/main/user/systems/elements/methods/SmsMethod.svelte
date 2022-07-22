<script>
    import fillTemplate from "../../../../../../utility/template.js"
    import MethodDetail from "../MethodDetail.svelte"
    import {slide} from "svelte/transition"

    export let method
    export let values

    $: message = fillTemplate(method.template, values)
</script>

<div class="method" transition:slide>
    <MethodDetail name="Способ">Отправка СМС-сообщения</MethodDetail>
    <MethodDetail name="Номер"><a href={`sms:${method.number}?body=${encodeURIComponent(message)}`}>{method.number}</MethodDetail>
    <MethodDetail name="Сообщение">{message}</MethodDetail>
    {#if method.comment}
        <MethodDetail name="Примечание">{fillTemplate(method.comment, values)}</MethodDetail>
    {/if}

    <br>
    <MethodDetail name="Подсказка:">Нажмите на ссылку в поле "Номер" для отправки сообщения с вашего устройства, или отправьте указанное собщение на указанный номер вручную. После успешной отправки сообщения нажмите "Завершить".</MethodDetail>
</div>
