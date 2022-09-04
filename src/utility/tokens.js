import CryptoJS from "crypto-js/core.js"
import AES from "crypto-js/aes.js"

import Messages from "utility/messages.js"

export default class Tokens {
    static AUTH_VERSION = 1
    
    static checkAuthVer() {
        if (!localStorage.authVer || localStorage.authVer < this.AUTH_VERSION) {
            delete localStorage.openToken
            delete localStorage.encryptedToken
            delete localStorage.login
            delete localStorage.displayName
        }
    }
    
    static store(tokens) {
        localStorage.openToken = tokens.open
        localStorage.encryptedToken = tokens.encrypted
        localStorage.authVer = this.AUTH_VERSION
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
