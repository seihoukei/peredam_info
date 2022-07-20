<script>
    import SetCodeButton from "./elements/SetCodeButton.svelte"
    import LogoutButton from "./elements/LogoutButton.svelte"
    import { fly, fade } from "svelte/transition"
    import {dialogFlyUp} from "../../utility/transitions.js"
    import TopLogo from "../login/elements/TopLogo.svelte"

    export let user = {
        systems : {

        }
    }
</script>

<div class="container" in:fade out:fly={dialogFlyUp}>
    <TopLogo />

    {user.name}
    <pre>
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
        Test
    </pre>
    <SetCodeButton />
    <LogoutButton />
</div>
