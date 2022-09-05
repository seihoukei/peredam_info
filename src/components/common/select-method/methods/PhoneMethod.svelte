<script>
    import MethodDetail from "components/common/select-method/methods/MethodDetail.svelte"

    import {slide} from "svelte/transition"

    import Values from "utility/values.js"

    export let method
    export let valuesToSubmit

    $: comment = Values.fillTemplate(method.comment, valuesToSubmit)

    $: link = `tel:${method.number}`

</script>

<div class="spacy-below flex" transition:slide>
    {#if method.type === "PHONE_AUTO"}
        <MethodDetail name="Способ">
            Звонок на автоответчик
        </MethodDetail>

    {:else}
        <MethodDetail name="Способ">
            Звонок оператору
        </MethodDetail>

    {/if}

    <MethodDetail name="Номер">
        <a href={link}>{method.number}</a>
    </MethodDetail>

    {#if comment !== ""}
        <MethodDetail name="Примечание">{comment}</MethodDetail>
    {/if}

    <br>
    <MethodDetail name="Подсказка">
        Нажмите на ссылку в поле "Номер" для набора номера или наберите его вручную. Если
        звонок не удался - выберите другой метод или попробуйте позже.
    </MethodDetail>
</div>
