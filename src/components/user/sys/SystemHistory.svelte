<script>
    import appState from "stores/app-state.js"
    import Api from "utility/api.js"
    import library from "stores/library.js"
    import Period from "utility/period.js"
    import modal from "stores/modal.js"

    export let system = {}

    let replySubmission = null

    $: provider = library.providers[system?.provider_id] ?? null
    $: variable = Object.entries(provider?.values ?? {}).filter(([name, value]) => !value.constant)

    function showReply(submission) {
        modal.notify(submission.reply)
    }

</script>

<div class="spacy-below centered center-text flex">
    <div class="centered center-text spacy-below">В таблице отображаются только данные, переданные через сайт.</div>
    {#await Api.getSystemHistory($appState.token, system.id)}
        Запрос истории...
    {:then result}
        {#if result.success}
            {#if result.data.length}
                <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">Дата</th>
                            {#each variable as [id, value]}
                                <th colspan="2">{value.name}</th>
                            {/each}
                            <th rowspan="2">Статус</th>
                        </tr>
                        <tr>
                            {#each variable as [id, value]}
                                <th>Расход</th>
                                <th>Значение</th>
                            {/each}
                        </tr>
                    </thead>
                {#each result.data as submission, index}
                    <tr>
                        <td>{Period.dateString(+submission.date * 1000)}</td>
                        {#each variable as [id, description]}
                            {@const current = submission.values?.[id]}
                            {@const previous = result.data[index+1]?.values?.[id]}
                            {@const difference = +current - +previous}
                            <td>
                                {#if difference >= 0}
                                    {@const days = Math.max(1,(submission.date - result.data[index+1].date) / 86400)}
                                    +{difference}
                                    <br>{(difference/days).toFixed(2)}/д
                                {/if}
                            </td>
                            <td>{current ?? ""}</td>
                        {/each}
                        <td>
                            {#if submission.replied}
                                <button on:click={() => showReply(submission)}>
                                    Есть ответ
                                </button>
                            {:else if submission.sent || submission.type !== "mailed"}
                                Отправлено
                            {:else}
                                В очереди
                            {/if}
                        </td>
                    </tr>
                {/each}
                </table>
                </div>
            {:else}
                Данные не передавались
            {/if}
        {:else}
            Произошла ошибка
        {/if}
    {/await}
</div>

<style>
    thead {
        background-color: #FFFFFF33;
    }

    tr:nth-of-type(even):not(thead tr) {
        background-color: #FFFFFF11;
    }

    thead tr:nth-of-type(2) {
        background-color: #00000033;
    }

    tr:nth-of-type(odd):not(thead tr) {
        background-color: #00000011;
    }

    td, th {
        padding: 2px 10px;
        vertical-align: center;
    }

    div.table {
        max-width: 100vw;
        overflow: auto;
        font-size: smaller;
    }

    td {
        white-space: nowrap;
    }
</style>
