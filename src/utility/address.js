export default class Address {
    static getPart(n = 0, ...conditionalParts) {
        const parts = new URL(window.location).search.slice(1).split("/")
        if (conditionalParts.some((part, index) => part !== parts[index]))
            return null
        return parts[n]
    }
    
    static set(...parts) {
        const url = new URL(window.location)
        
        const cutoffByNull = parts.indexOf(null)
        if (cutoffByNull !== -1) {
            parts = parts.slice(0, cutoffByNull)
        }
        
        const cutoffByUndefined = parts.indexOf(undefined)
        if (cutoffByUndefined !== -1) {
            parts = parts.slice(0, cutoffByUndefined)
        }
        
        const cutoffByEmpty = parts.indexOf(``)
        if (cutoffByEmpty !== -1) {
            parts = parts.slice(0, cutoffByEmpty)
        }
        
        url.search = "?" + parts.join("/")
        window.history.replaceState(null, null, url.href)
    }
    
    static stringify(object) {
        return Object.entries(object).filter(([key,value]) => value).map(([key,value]) => key + "=" + encodeURIComponent(value)).join("&")
    }
    
    static parse(string = '') {
        return string
            .split("&").map(x => x.split("="))
            .reduce((object, [id, value]) => ({
                ...object,
                [id] : decodeURIComponent(value),
            }),{})
    }
}
