export default function formatValue(format, value = "") {
    if (value === "")
        return null
    
    const [type, parameters = ""] = format.split(":")
    
    if (type === "NUM") {
        let result = parseFloat(value)
        
        if (isNaN(result))
            return null
        
        const [digits = "", decimal = ""] = parameters.split(",")
        
        if (digits !== "" && result >= 10 ** +digits)
            return null
        
        return result.toFixed(decimal || 0)
    }
    
    return null
}
