<script>
    import tokens from "../../stores/tokens.js"
    import CodeInput from "./elements/CodeInput.svelte"
    import TopLogo from "./elements/TopLogo.svelte"
    import {fly} from 'svelte/transition';
    import {dialogFlyDown} from "../../utility/transitions.js"

    const resetToken = () => {
        tokens.reset("encrypted")
    }

    const checkCode = ({detail:code}) => {
        tokens.decrypt("current", code)
    }

</script>

<div class="container" transition:fly={dialogFlyDown}>
    <TopLogo />
    <span>Введите код для быстрого входа:</span>
    <CodeInput on:submit={checkCode}/>
    <button on:click={resetToken}>Войти, используя пароль</button>
</div>

<style>
    span {
        font-size: var(--3u);
        margin: 0 0 var(--2u);
    }


    button {
        font-size: var(--2u);
        margin: var(--4u) 0 0;
    }
</style>
