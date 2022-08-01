<script>
    import {fade} from "svelte/transition"

    import Transitions from "utility/transitions.js"
    import appState from "stores/app-state.js"
    import HelpPages from "help/help-pages.js"

    $: helpPage = $appState.helpPage

    function close() {
        appState.setHelpPage("")
    }
</script>

{#if helpPage !== ``}
    <div class="fullscreen-container" transition:fade={Transitions.fastFade}>
        <div class="dialog">
            Помощь по текущей странице

            <div>{@html HelpPages.get(helpPage)}</div>

            <button on:click={close}>Закрыть</button>

        </div>

    </div>
{/if}
