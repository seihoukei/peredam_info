import CryptoJS from "crypto-js/core.js"
import AES from "crypto-js/aes.js"

import Messages from "utility/messages.js"

export default class Tokens {
    static store(tokens) {
        localStorage.openToken = tokens.open
        localStorage.encryptedToken = tokens.encrypted
    }
    
    static retrieve() {
        return {
            current: localStorage.openToken ?? "",
            encrypted: localStorage.encryptedToken ?? "",
            open: localStorage.openToken ?? "",
        }
    }
    
    static clear() {
        localStorage.openToken = ""
        localStorage.encryptedToken = ""
    }
    
    static encrypt(decrypted, code) {
        const string = `encode(${decrypted}, ${code})`
        return Messages.success(AES.encrypt(string, code).toString())
    }
    
    static decrypt(encrypted, code) {
        try {
            const string = AES.decrypt(encrypted, code).toString(CryptoJS.enc.Utf8)
            const match = string.match(/^encode\((?<data>.*), (?<code>.*)\)/)
            
            if (!match) {
                return Messages.failure()
            }
            
            const data = match.groups
            if (data.code !== code) {
                return Messages.failure()
            }
            
            return Messages.success(data.data)
        } catch (e) {
            return Messages.failure("Неправильный код")
        }
    }
    
}
