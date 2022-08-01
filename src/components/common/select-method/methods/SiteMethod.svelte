<script>
    import MethodDetail from "components/common/select-method/methods/MethodDetail.svelte"

    import {slide} from "svelte/transition"

    import Values from "utility/values.js"

    export let method
    export let valuesToSend

    $: comment = Values.fillTemplate(method.comment, valuesToSend)

    $: link = method.address

</script>

<div class="spacy-below flex" transition:slide>
    <MethodDetail name="Способ">
        Передача вручную на сайте
    </MethodDetail>

    <MethodDetail name="Адрес">
        <a href={link}
           rel="noopener noreferrer"
           target="_blank">{method.address}</a>

    </MethodDetail>

    {#if comment !== ""}
        <MethodDetail name="Примечание">{comment}</MethodDetail>
    {/if}

    <br>
    <MethodDetail name="Подсказка">
        Нажмите на ссылку в поле "Адрес" для перехода на сайт оператора.
    </MethodDetail>
</div>
