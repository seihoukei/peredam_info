<script>
    import fillTemplate from "../../../../../utility/template.js"
    import MethodDetail from "../MethodDetail.svelte"
    import {slide} from "svelte/transition"

    export let method
    export let values

    $: comment = fillTemplate(method.comment, values)
    $: link = `tel:${method.number}`

</script>

<div class="spacy-below flex" transition:slide>
    {#if method.type === "PHONE_AUTO"}
        <MethodDetail name="Способ">Звонок на автоответчик</MethodDetail>
    {:else}
        <MethodDetail name="Способ">Звонок оператору</MethodDetail>
    {/if}
    <MethodDetail name="Номер"><a href={link}>{method.number}</a></MethodDetail>
    {#if comment !== ""}
        <MethodDetail name="Примечание">{comment}</MethodDetail>
    {/if}
    <br>
    <MethodDetail name="Подсказка:">Нажмите на ссылку в поле "Телефон" для набора номера или наберите его вручную. После успешной передачи показаний нажмите "Завершить". Если звонок не удался - выберите другой метод или попробуйте позже.</MethodDetail>
</div>
