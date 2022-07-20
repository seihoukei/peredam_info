export default class TokenEncryption {
    static encrypt(decrypted, code) {
        return `encode(${decrypted}, ${code})`
    }
    
    static decrypt(encrypted, code) {
        const match = encrypted.match(/^encode\((?<data>.*), (?<code>.*)\)/)
        
        if (!match)
            return ""
        
        const data = match.groups
        if (data.code !== code)
            return ""
        
        return data.data
    }
}
