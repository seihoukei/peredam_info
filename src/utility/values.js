export default class Values {
    static formatValue(format, value = "") {
        if (value === "") {
            return ""
        }
        
        const [type, parameters = ""] = format.split(":")
        
        if (type === "NUM") {
            let result = parseFloat(value)
            
            if (isNaN(result)) {
                return ""
            }
            
            const [digits = "", decimal = ""] = parameters.split(",")
            
            if (digits !== "" && result >= 10 ** +digits) {
                return ""
            }
            
            let output = result.toFixed(decimal || 0)
            
            if (digits !== "") {
                const integer = output.split(/,\./)[0]
                const delta = +digits - integer.length
                output = "0".repeat(delta) + output
            }
            
            return output
        }
    
        return ""
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
    
    static fillTemplate(template = "", values) {
        return template.replace(/\<.*?\>/g, match => values[match.slice(1, -1)] ?? "")
    }
    
    static stringify(object) {
        return Object.entries(object)
            .filter(([key, value]) => value)
            .map(([key, value]) => key + "=" + encodeURIComponent(value))
            .join("&")
    }
    
    static parse(string = "") {
        if (string === "")
            return {}
        
        return string
            .split("&").map(x => x.split("="))
            .reduce((object, [id, value]) => ({
                ...object,
                [id]: decodeURIComponent(value),
            }), {})
    }
    
    static isEmpty(value) {
        return value === "" || value === null
    }
    
    static emptyOnChange() {
        return {}
    }
}
