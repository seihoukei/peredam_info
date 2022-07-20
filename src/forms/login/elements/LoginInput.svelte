<script>
    import {failure, success} from "../../../utility/messages.js"
    import StatusDisplay from "./StatusDisplay.svelte"
    import Api from "../../../utility/api.js"

    export let value = ""
    export let isValid = false
    export let validateOnline = false

    let checkTimeout = null
    const check = async () => {
        isValid = false

        if (value.length < 6)
            return failure("Логин слишком короткий")

        if (value.length > 32)
            return failure("Логин слишком длинный")

        if (!validateOnline)
            return success("Допустимый логин")

        //renewable delay before requesting new status
        await new Promise((resolve) => {
            if (checkTimeout !== null)
                clearTimeout(checkTimeout)
            checkTimeout = setTimeout(resolve, 300)
        })
        checkTimeout = null

        return Api.checkLogin(value)
    }

    $: loginStatus = check(value, validateOnline)
    $: loginStatus.then(result => {
        isValid = result.success
    })

</script>

<input bind:value placeholder="Логин" type="text">
{#await loginStatus}
    <StatusDisplay>...проверка логина...</StatusDisplay>
{:then status}
    <StatusDisplay status={status.success?"ok":"error"}>{status.data}</StatusDisplay>
{/await}
