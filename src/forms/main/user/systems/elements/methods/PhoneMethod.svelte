<script>
    import fillTemplate from "../../../../../../utility/template.js"
    import MethodDetail from "../MethodDetail.svelte"
    import {slide} from "svelte/transition"

    export let method
    export let values

</script>

<div class="method" transition:slide>
    {#if method.type === "PHONE_AUTO"}
        <MethodDetail name="Способ">Звонок на автоответчик</MethodDetail>
    {:else}
        <MethodDetail name="Способ">Звонок оператору</MethodDetail>
    {/if}
    <MethodDetail name="Номер"><a href={`tel:${method.number}`}>{method.number}</a></MethodDetail>
    {#if method.comment}
        <MethodDetail name="Примечание">{fillTemplate(method.comment, values)}</MethodDetail>
    {/if}
    <br>
    <MethodDetail name="Подсказка:">Нажмите на ссылку в поле "Телефон" для набора номера или наберите его вручную. После успешной передачи показаний нажмите "Завершить". Если звонок не удался - выберите другой метод или попробуйте позже.</MethodDetail>
</div>
