<script>
    import LoginInput from "./elements/LoginInput.svelte"
    import PasswordInput from "./elements/PasswordInput.svelte"
    import ReturningBlock from "./elements/ReturningBlock.svelte"
    import RegisteringBlock from "./elements/RegisteringBlock.svelte"
    import TopLogo from "./elements/TopLogo.svelte"
    import {fly} from 'svelte/transition';
    import {dialogFlyUp} from "../../utility/transitions.js"

    let login = ""
    let isLoginValid = false

    let password = ""
    let isPasswordValid = false

    let isReturning = true
    let isRegistering = false

    $: isValid = isLoginValid && isPasswordValid

    //Animations

    let isGoingToRegister = false

    const startAnimation = () => {
        isRegistering = false
        isReturning = false
        //outroend event leads to finishAnimation
    }

    const finishAnimation = () => {
        if (isGoingToRegister) {
            isRegistering = true
        } else {
            isReturning = true
        }
    }

</script>

<div class="login container" transition:fly={dialogFlyUp}>
    <TopLogo />

    <div class="dialog">
        <LoginInput bind:value={login} bind:isValid={isLoginValid} validateOnline={isRegistering} />
        <PasswordInput bind:value={password} bind:isValid={isPasswordValid} validate={isRegistering}/>

        <label>
            <input type="checkbox" on:change={startAnimation} bind:checked={isGoingToRegister}> Новый пользователь
        </label>

        {#if isReturning}
            <ReturningBlock on:outroend={finishAnimation} {login} {password} {isValid}/>
        {:else if isRegistering}
            <RegisteringBlock on:outroend={finishAnimation} {login} {password} {isValid}/>
        {/if}

    </div>
</div>

<style>

    div.dialog {
        width : var(--45u);
        padding : 20px;

        display : flex;
        flex-direction: column;
        row-gap: var(--2u);
    }

    :global(div.login.container label){
        font: var(--3u) Exo2, sans-serif;
    }

    :global(div.login.container button) {
        margin: var(--3u) 0 0;
    }

    :global(div.login.container input) {
        background-color: var(--element-background);
        color: var(--element-text-color);
    }

    :global(div.login.container input::placeholder) {
        color: var(--input-placeholder-color);
    }

</style>
