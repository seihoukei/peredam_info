<script>
    import tokens from "../../stores/tokens.js"
    import CodeInput from "./elements/CodeInput.svelte"
    import TopLogo from "./elements/TopLogo.svelte"
    import {fly} from 'svelte/transition';
    import {dialogFlyDown} from "../../utility/transitions.js"

    let firstCode = ""
    let confirm = false
    let message = "Вы можете установить код для быстрого входа:"

    const checkCode = ({detail : code}) => {
       if (firstCode === "") {
            firstCode = code
        } else {
            if (code === firstCode) {
                tokens.encrypt("new", code)
                tokens.reset("open")
                proceed()
            } else {
                firstCode = ""
                confirm = false
                message = "Введеные коды не совпали, вы можете попробовать снова:"
            }
        }
    }

    const saveWithoutCode = () => {
        tokens.assign("open", "new")
        tokens.reset("encrypted")
        proceed()
    }

    const dontSave = () => {
        proceed()
    }

    const proceed = () => {
        tokens.assign("current", "new")
        tokens.reset("new")
    }

    const finishAnimation = () => {
        confirm = true
    }
</script>

<div class="container" transition:fly={dialogFlyDown}>
    <TopLogo />

    {#if firstCode === ""}
        <span out:fly|local={{x:-100}} on:outroend={finishAnimation}>{message}</span>
    {:else if confirm}
        <span in:fly|local={{x:100}}>Введите тот же самый код ещё раз для проверки:</span>
    {/if}

    <CodeInput on:submit={checkCode}/>

    <div class="buttons">
        {#if $tokens.encrypted}
            <button on:click={saveWithoutCode}>Убрать код</button>
        {:else}
            <button on:click={saveWithoutCode}>Не надо кода</button>
        {/if}

        {#if $tokens.open || $tokens.encrypted}
            <button on:click={proceed}>Не надо ничего менять</button>
        {:else}
            <button on:click={dontSave}>Не запоминать меня</button>
        {/if}
    </div>
</div>

<style>
    span {
        font-size: var(--2u);
        text-align: center;
        margin: 0 0 var(--2u);
    }

    button {
        font-size: var(--2u);
        margin: var(--4u) 0 0;
    }
</style>
