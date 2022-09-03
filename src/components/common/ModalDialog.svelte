<script>
    import {fade} from "svelte/transition"

    import Transitions from "utility/transitions.js"
    import FocusWatcher from "utility/focus-watcher.js"
    import modal from "stores/modal.js"

    let dialog

    $: isShown = $modal.isShown
    $: isError = $modal.isError
    $: message = $modal.message
    $: buttons = $modal.buttons

    $: focus(isShown)

    function checkKey(event) {
        if (isShown) {
            for (let button of $modal.buttons) {
                if (button.keyCodes?.includes(event.keyCode)) {
                    event.stopPropagation()
                    event.preventDefault()
                    modal.close(button.callback)
                    FocusWatcher.focus()
                    return
                }
            }
        }
    }

    function focus() {
        dialog?.focus?.()
    }

</script>

<svelte:window on:keydown={checkKey}/>

{#if isShown}
    <div class="fullscreen-container" transition:fade={Transitions.fastFade}>
        <div class="dialog" tabindex="0" bind:this={dialog}>
            {#if isError}
                <span class="large">Ошибка</span>
            {/if}
            <span class="center-text pre">{message}</span>
            <div class="spaced row-flex">
                {#each buttons as button}
                    <button on:click={() => modal.close(button.callback)}>{button.text}</button>
                {/each}
            </div>
        </div>
    </div>
{/if}
