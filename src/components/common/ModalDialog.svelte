<script>
    import modal from "../../stores/modal.js"
    import {fade} from "svelte/transition"
    import Transitions from "../../utility/transitions.js"
    import FocusWatcher from "../../utility/focus-watcher.js"

    $: error = $modal.error
    $: waiting = $modal.waiting
    $: asking = $modal.asking

    let dialog

    $: focus(error, waiting, asking)

    function checkKey(event) {
        if (error || asking) {
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

{#if error || waiting || asking}
    <div class="fullscreen-container" transition:fade={Transitions.fastFade}>
        <div class="dialog" tabindex="0" bind:this={dialog}>
            {#if $modal.error}
                <span class="large">Ошибка</span>
                <span class="center-text">{$modal.errorMessage}</span>
                <div class="spaced row-flex">
                    {#each $modal.buttons as button}
                        <button on:click={() => modal.close(button.callback)}>{button.text}</button>
                    {/each}
                </div>
            {:else if $modal.asking}
                <span class="large">Внимание!</span>
                <span class="center-text">{$modal.askingMessage}</span>
                <div class="spaced row-flex">
                    {#each $modal.buttons as button}
                        <button on:click={() => modal.close(button.callback)}>{button.text}</button>
                    {/each}
                </div>
            {:else}
                <span class="large">Ожидание</span>
                <span class="center-text">{$modal.waitingMessage}</span>
            {/if}
        </div>
    </div>
{/if}
