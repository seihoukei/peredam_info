<script>
    import LogoutButton from "./main/elements/LogoutButton.svelte"
    import SetCodeButton from "./main/elements/SetCodeButton.svelte"
    import { fade } from "svelte/transition"
    import Api from "../utility/api.js"
    import Welcome from "./main/Welcome.svelte"
    import StartingPage from "./main/StartingPage.svelte"

    export let token = ""

    $: userData = Api.getUserData(token)

</script>

{#await userData}
    <Welcome />
{:then user}
    <StartingPage user={user.data}/>
{/await}
