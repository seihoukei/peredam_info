<script>
    import fillTemplate from "../../../../../../utility/template.js"
    import MethodDetail from "../MethodDetail.svelte"
    import {slide} from "svelte/transition"

    export let method
    export let values

</script>

<div class="method" transition:slide>
    <MethodDetail name="Способ">Передача вручную на сайте</MethodDetail>
    <MethodDetail name="Адрес"><a href={method.address} target="_blank" rel="noopener noreferrer">{method.address}</a></MethodDetail>
    {#if method.comment}
        <MethodDetail name="Примечание">{fillTemplate(method.comment, values)}</MethodDetail>
    {/if}
    <br>
    <MethodDetail name="Подсказка:">Нажмите на ссылку в поле "Адрес" для перехода на сайт оператора. После успешной передачи показаний нажмите "Завершить".</MethodDetail>
</div>
