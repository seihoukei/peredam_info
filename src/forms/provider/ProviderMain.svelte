<script>
    import TopLogo from "../TopLogo.svelte"
    import UserMenu from "../user/elements/UserMenu.svelte"
    import { fly, fade } from "svelte/transition"
    import {dialogFlyUp} from "../../utility/transitions.js"
    import library from "../../stores/library.js"
    import token from "../../stores/token.js"
    import Api from "../../utility/api.js"

    export let provider_id = null

    $:provider = library.providers[provider_id]

    let end = new Date()
    let start = new Date()
    start.setDate(end.getDate() - 1)

    const page = 0

    $: listRequest = Api.getProviderRecords($token, page)

    function update() {

    }
</script>

<div class="centered top-central wrapper flex" in:fade out:fly={dialogFlyUp}>
    <TopLogo />
    <UserMenu username={provider.name}/>

    <button class="large" on:click={update}>Обновить</button>

    {#await listRequest}
        Получение записей...
    {:then result}
        {#if result.success && result.data?.records?.length}
            <table>
                <thead>
                    <th>Дата и время</th>
                    <th>Значения</th>
                    <th>Статус</th>
                </thead>
                {#each result.data.records as record}
                    <tr>
                        <td> {new Date(record.date).toString().split(" ").slice(1,5).join(" ")} </td>
                        <td> {record.record} </td>
                        <td> {record.status} </td>
                    </tr>
                {/each}
                </table>
        {:else}
            Нет записей.
        {/if}
    {/await}
</div>
