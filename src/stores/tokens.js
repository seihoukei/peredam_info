import {derived, writable} from "svelte/store"
import TokenEncryption from "../utility/token-encryption.js"

const {update, subscribe} = writable({
    new : "",
    current : localStorage.openToken ?? "",
    open : localStorage.openToken ?? "",
    encrypted : localStorage.encryptedToken ?? "",
})

const tokens = {
    subscribe,
    
    setNew: value => update(old => ({...old,
        new : value,
    })),
    
    assign: (destination, source) => update(old => ({...old,
        [destination] : old[source],
    })),
    
    encrypt: (source, code) => update(old => ({...old,
        encrypted : TokenEncryption.encrypt(old[source], code),
    })),
    
    decrypt: (destination, code) => update(old => ({...old,
        [destination] : TokenEncryption.decrypt(old.encrypted, code),
    })),
    
    reset: (target) => update(old => ({...old,
        [target] : "",
    })),
}

tokens.subscribe((value) => {
    localStorage.openToken = value.open ?? ""
    localStorage.encryptedToken = value.encrypted ?? ""
})

export default tokens

export const loggedIn = derived(tokens, (tokens => tokens.current))
export const settingCode = derived(tokens, (tokens => tokens.new && !tokens.current))
export const checkingCode = derived(tokens, (tokens =>  tokens.encrypted && !tokens.current))
export const userToken = derived(tokens, (tokens => tokens.current))
