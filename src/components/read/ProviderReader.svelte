<script>
    import UserMenu from "components/common/user-menu/UserMenu.svelte"

    import library from "stores/library"
    import appState from "stores/app-state"

    import Api from "utility/api"

    let listPage = 0

    let end = new Date()
    let start = new Date()

    start.setDate(end.getDate() - 1)

    $: user_provider_id = $appState.user_provider_id
    $: token = $appState.token

    $: provider = library.providers[user_provider_id] ?? null
    $: listRequest = Api.getProviderRecords(token, listPage)

    function update() {

    }

</script>

<UserMenu username={provider?.name}/>

<button class="large"
        on:click={update}>Обновить</button>

{#await listRequest}
    Получение записей...

{:then result}
    {#if result.success && result.data?.records?.length}
        <table>
            <thead>
            <tr>
                <th>Дата и время</th>
                <th>Значения</th>
                <th>Тип</th>
            </tr>
            </thead>

            {#each result.data.records as record}
                <tr>
                    <td> {new Date(record.date).toString().split(" ").slice(1, 5).join(" ")} </td>
                    <td> {record.record} </td>
                    <td> {record.type} </td>
                </tr>
            {/each}

        </table>

    {:else}
        Нет записей.

    {/if}

{/await}
