<script>
    import Api from "../utility/api.js"
    import Welcome from "./main/user/Welcome.svelte"
    import UserView from "./main/user/UserView.svelte"

    export let token = ""

    $: userSystems = Api.getUserData(token)

</script>

{#await userSystems}
    <Welcome />
{:then result}
    {#if result.success}
        <UserView user={result.data}/>
    {:else}
        Прозошла ошибка :(
    {/if}
{/await}
