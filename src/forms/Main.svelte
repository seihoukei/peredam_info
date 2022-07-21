<script>
    import Api from "../utility/api.js"
    import Welcome from "./main/user/Welcome.svelte"
    import UserView from "./main/user/UserView.svelte"
    import {isLibraryReady} from "../stores/library.js"

    export let token = ""

    $: userSystems = Api.getUserData(token)

</script>

{#await userSystems}
    <Welcome />
{:then result}
    {#if result.success}
        {#if isLibraryReady}
            <UserView user={result.data}/>
        {:else}
            Загрузка библиотеки...
        {/if}
    {:else}
        Прозошла ошибка :(
    {/if}
{/await}
