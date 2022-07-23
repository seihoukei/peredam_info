<script>
    import {createEventDispatcher} from "svelte"

    export let code = ""
    export let length = 4

    $: maskedCode =
        "● ".repeat(Math.max(0, code.length - 1)) +
        code.slice(-1) +
        " ○".repeat(Math.max(0, length - code.length))

    const dispatch = createEventDispatcher()

    const add = (x) => {
        code += x
        if (code.length >= length) {
            code = code.slice(0,length)
            dispatch("submit", code)
        }
    }

    const reset = () => {
        code = ""
    }

    const back = () => {
        code = code.slice(0,-1)
    }

    // keyCodes: [user, numpad without numlock, numpad with numlock]
    //noinspection MagicNumberJS
    const buttons = [
        {text: "1", keyCodes: [49, 35, 97 ], action: () => add(1)},
        {text: "2", keyCodes: [50, 40, 98 ], action: () => add(2)},
        {text: "3", keyCodes: [51, 34, 99 ], action: () => add(3)},
        {text: "4", keyCodes: [52, 37, 100], action: () => add(4)},
        {text: "5", keyCodes: [53, 12, 101], action: () => add(5)},
        {text: "6", keyCodes: [54, 39, 102], action: () => add(6)},
        {text: "7", keyCodes: [55, 36, 103], action: () => add(7)},
        {text: "8", keyCodes: [56, 38, 104], action: () => add(8)},
        {text: "9", keyCodes: [57, 33, 105], action: () => add(9)},
        {text: "X", keyCodes: [27]         , action: () => reset()},
        {text: "0", keyCodes: [48, 45, 96 ], action: () => add(0)},
        {text: "<", keyCodes: [8]          , action: () => back()},
    ]

    const onKeyDown = (event) => {
        for (const button of buttons) {
            if (button.keyCodes.includes(event.keyCode)) {
                button.action()
                event.preventDefault()
            }
        }
    }

</script>

<svelte:window on:keydown={onKeyDown} />

<div class="keypad-container">
    <div class="code">{maskedCode}</div>
    <div class="keypad" tabindex="0">
        {#each buttons as button}
            <button tabindex="-1" on:click={button.action}>{button.text}</button>
        {/each}
    </div>
</div>

<style>
    div.keypad-container {
        display : flex;
        flex-direction: column;
        align-items: center;
        width : 320px;
        row-gap: 50px;
    }

    div.code {
        display : flex;
        align-items: center;
        justify-content: center;

        background: var(--element-background);
        color : var(--element-text-color);
        font: 50px Nova, monospace;

        border-radius: 30px;
        padding : 0 30px;
        white-space: nowrap;
    }

    div.keypad {
        display:grid;
        --key-size : 50px;
        grid-template-columns: var(--key-size) var(--key-size) var(--key-size);
        grid-template-rows: var(--key-size) var(--key-size) var(--key-size) var(--key-size);
        grid-gap: 25px;
    }

    div.keypad button {
        font: 30px Nova, monospace;
        border-radius: 50%;
        border : none;
        cursor : pointer;

        display : flex;
        align-items: center;
        justify-content: center;
    }
</style>
