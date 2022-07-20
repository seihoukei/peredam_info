<script>
    import {failure, success} from "../../../utility/messages.js"
    import StatusDisplay from "./StatusDisplay.svelte"

    export let value = ""
    export let isValid = false
    export let validate = false

    const check = () => {
        if (!validate)
            return success("Пароль не проверялся")

        if (value.length < 6)
            return failure("Пароль слишком короткий")

        if (value.length > 128)
            return failure("Пароль слишком длмнный")

        return success("Допустимый пароль")
    }

    $: status = check(value, validate)
    $: isValid = status.success

</script>

<input bind:value placeholder="Пароль" type="password">
<StatusDisplay status={status.success?"ok":"error"}>{status.data}</StatusDisplay>
