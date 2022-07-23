<script>
    import LoginPrompt from "../LoginPrompt.svelte"

    export let phone
</script>

<LoginPrompt type="tel" bind:value={phone} on:submit >
    Введите номер телефона
</LoginPrompt>
