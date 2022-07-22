<script>
    import Api from "../utility/api.js"
    import Welcome from "./main/user/Welcome.svelte"
    import UserView from "./main/user/UserView.svelte"
    import {libraryReady} from "../stores/library.js"

    export let token = ""

    $: userSystems = Api.getUserData(token)

</script>

{#await userSystems}
    <Welcome />
{:then result}
    {#if $libraryReady}
        {#if result.success}
            <UserView user={result.data} {token}/>
        {:else}
            Прозошла ошибка :(
        {/if}
    {:else}
        <Welcome />
    {/if}
{/await}
