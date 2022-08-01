<script>
    import DatePicker from "components/read/elements/DatePicker.svelte"

    export let start = Date()
    export let end = Date()

</script>

<div class="centered spacy-below row-flex">
    <div class="centered spacy-below flex">
        Начало отчета:
        <DatePicker bind:date={start}/>
    </div>

    -

    <div class="centered spacy-below flex">
        Конец отчета:
        <DatePicker bind:date={end}/>
    </div>

    <button on:click>Обновить</button>
</div>
