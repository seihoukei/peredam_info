import {failure, success} from "./messages.js"

export default class Tokens {
    static store(tokens) {
        localStorage.openToken = tokens.open
        localStorage.encryptedToken = tokens.encrypted
    }
    
    static retrieve() {
        return {
            current : localStorage.openToken ?? "",
            encrypted : localStorage.encryptedToken ?? "",
            open : localStorage.openToken ?? "",
        }
    }
    
    static clear() {
        localStorage.openToken = ""
        localStorage.encryptedToken = ""
    }
    
    static encrypt(decrypted, code) {
        return success(`encode(${decrypted}, ${code})`)
    }
    
    static decrypt(encrypted, code) {
        const match = encrypted.match(/^encode\((?<data>.*), (?<code>.*)\)/)
        
        if (!match)
            return failure()
        
        const data = match.groups
        if (data.code !== code)
            return failure()
        
        return success(data.data)
    }
}
