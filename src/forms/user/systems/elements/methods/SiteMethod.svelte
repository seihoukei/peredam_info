<script>
    import fillTemplate from "../../../../../utility/template.js"
    import MethodDetail from "../MethodDetail.svelte"
    import {slide} from "svelte/transition"

    export let method
    export let values

    $: comment = fillTemplate(method.comment, values)
    $: link = method.address

</script>

<div class="spacy-below flex" transition:slide>
    <MethodDetail name="Способ">Передача вручную на сайте</MethodDetail>
    <MethodDetail name="Адрес"><a href={link} target="_blank" rel="noopener noreferrer">{method.address}</a></MethodDetail>
    {#if comment !== ""}
        <MethodDetail name="Примечание">{comment}</MethodDetail>
    {/if}
    <br>
    <MethodDetail name="Подсказка">Нажмите на ссылку в поле "Адрес" для перехода на сайт оператора. После успешной передачи показаний нажмите "Завершить".</MethodDetail>
</div>
