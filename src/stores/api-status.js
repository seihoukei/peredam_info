import {writable} from "svelte/store"

const DISPLAY_TIME = 3000

const {subscribe, update} = writable({
    status: '',
    waiting: false,
    message: "",
})

const apiStatus = {
    subscribe,
    
    hideTimeout : null,
    
    resetHideTimeout() {
        if (this.hideTimeout)
            clearTimeout(this.hideTimeout);
    },
    
    setHideTimeout(time = DISPLAY_TIME) {
        this.resetHideTimeout()
        this.hideTimeout = setTimeout(
            () => this.hide(),
            time
        )
    },
    
    error(message = "") {
        update(state => ({
            ...state,
            status: 'error',
            waiting: false,
            message,
        }))
        
        this.setHideTimeout()
    },
    
    success(message = "") {
        update(state => ({
            ...state,
            status: 'success',
            waiting: false,
            message,
        }))
    
        this.setHideTimeout()
    },
    
    wait(message = "") {
        update(state => ({
            ...state,
            status: 'waiting',
            waiting: true,
            message,
        }))
    
        this.resetHideTimeout()
    },
    
    hide() {
        update(state => ({
            ...state,
            status: '',
            waiting: false,
            message: '',
        }))

        this.resetHideTimeout()
    },
    
    async await(promise, message = "Ожидание...") {
        //TODO: proper silent waiting
        
        this.wait(message)
        
        const result = await promise
        
        this.hide()
        
        return result
    },
}

export default apiStatus
