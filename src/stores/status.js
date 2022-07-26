import {writable} from "svelte/store"

const {subscribe, update} = writable({
    error : false,
    errorMessage : "",
    
    waiting : false,
    waitingMessage : "",
})

const status = {
    subscribe,
    
    callback : null,
    
    error (message = "", callback = null) {
        update(state => ({
            ...state,
            error : true,
            errorMessage : message,
        }))
        
        this.callback = callback
    },
    
    recover() {
        update(state => ({
            ...state,
            error : false,
        }))
        
        if (this.callback) {
            this.callback()
        }
    },
    
    startWaiting (message = "") {
        update(state => ({
            ...state,
            waiting : true,
            waitingMessage : message,
        }))
    },
    
    stopWaiting () {
        update(state => ({
            ...state,
            waiting : false,
        }))
    },
    
}

export default status
