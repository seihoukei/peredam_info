<script>
    import UserMenu from "../../common/user-menu/UserMenu.svelte"
    import library from "../../../stores/library.js"
    import Api from "../../../utility/api.js"
    import appState from "../../../stores/app-state.js"

    $: provider = library.providers[$appState.user_provider_id] ?? null

    let end = new Date()
    let start = new Date()
    start.setDate(end.getDate() - 1)

    const page = 0

    $: listRequest = Api.getProviderRecords($appState.token, page)

    function update() {

    }

</script>

<UserMenu username={provider?.name}/>

<button class="large" on:click={update}>Обновить</button>

{#await listRequest}
    Получение записей...
{:then result}
    {#if result.success && result.data?.records?.length}
        <table>
            <thead><tr>
                <th>Дата и время</th>
                <th>Значения</th>
                <th>Тип</th>
            </tr></thead>
            {#each result.data.records as record}
                <tr>
                    <td> {new Date(record.date).toString().split(" ").slice(1,5).join(" ")} </td>
                    <td> {record.record} </td>
                    <td> {record.type} </td>
                </tr>
            {/each}
            </table>
    {:else}
        Нет записей.
    {/if}
{/await}
