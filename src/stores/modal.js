import {writable} from "svelte/store"

const DEFAULT_BUTTONS = [
    {
        text: "Закрыть",
        keyCodes: [13, 27, 32], //enter, esc, space
        callback: null,
        back : true,
    },
]

const {subscribe, update} = writable({
    isError: false,
    isShown : false,
    message : '',
    buttons : [],
})

const modal = {
    subscribe,
    
    error(message = "", buttons = DEFAULT_BUTTONS) {
        update(state => ({
            ...state,
            isShown : true,
            isError: true,
            message,
            buttons,
        }))
        history.pushState(history.state, "")
    },
    
    notify(message = "", buttons = DEFAULT_BUTTONS) {
        update(state => ({
            ...state,
            isShown : true,
            isError: false,
            message,
            buttons,
        }))
        history.pushState(history.state, "")
    },
    
    close(callback) {
        update(state => ({
            ...state,
            isShown: false,
            isError: false,
        }))
        
        callback?.()
    },
    
    backAction() {
        let buttons = null
        this.subscribe(value => buttons = value.buttons)()
        const backButton = buttons.find((button) => button.back)
        this.close(backButton?.callback)
    }
    
}

export default modal
