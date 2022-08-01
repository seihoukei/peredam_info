import {writable} from "svelte/store"

const DEFAULT_BUTTONS = [
    {
        text: "Закрыть",
        keyCodes: [13, 27, 32], //enter, esc, space
        callback: null,
    },
]

const {subscribe, update} = writable({
    error: false,
    errorMessage: "",
    
    waiting: false,
    waitingMessage: "",
    
    buttons: [],
})

const modal = {
    subscribe,
    
    error(message = "", buttons = DEFAULT_BUTTONS) {
        update(state => ({
            ...state,
            error: true,
            errorMessage: message,
            buttons,
        }))
    },
    
    notify(message = "", buttons = DEFAULT_BUTTONS) {
        update(state => ({
            ...state,
            asking: true,
            askingMessage: message,
            buttons,
        }))
        
    },
    
    success(message) {
        //TODO: Display positive result and disappear
    },
    
    close(callback) {
        update(state => ({
            ...state,
            error: false,
            asking: false,
        }))
        
        callback?.()
    },
    
    startWaiting(message = "") {
        update(state => ({
            ...state,
            waiting: true,
            waitingMessage: message,
        }))
    },
    
    stopWaiting() {
        update(state => ({
            ...state,
            waiting: false,
        }))
    },
    
    async await(promise, message = "Ожидание...") {
        this.startWaiting(message)
        const result = await promise
        this.stopWaiting()
        
        return result
    },
}

export default modal
