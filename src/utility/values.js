import appState from "stores/app-state.js"
import Address from "utility/address.js"

export default class Values {
    static formatValue(format, value) {
        if (value === "") {
            return null
        }
        
        const [type, parameters = ""] = format.split(":")
        
        if (type === "NUM") {
            let result = parseFloat(value)
            
            if (isNaN(result)) {
                return null
            }
            
            const [digits = "", decimal = ""] = parameters.split(",")
            
            if (digits !== "" && result >= 10 ** +digits) {
                return null
            }
            
            return result.toFixed(decimal || 0)
        }
        
        return null
    }
    
    static formatValues(data = {}, values) {
        const result = {}
        for (let [key, value] of Object.entries(values)) {
            if (data[key]?.type) {
                result[key] = this.formatValue(data[key].type, value)
            }
        }
        return result
    }
    
    static inputTemplate(template = "") {
        if (template) {
            return Address.parse(template)
        }
        return {}
    }
}
