export default class Web {
    
    static httpStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response.statusText)
        }
    }
    
    static fetch(url, postData, credentials = false) {
        if (postData === undefined || postData === null) {
            return fetch(url, {
                credentials: credentials ? "include" : "same-origin",
            })
        }
        
        return fetch(url, {
            method: "POST",
            credentials: credentials ? "include" : "same-origin",
            body: JSON.stringify(postData),
        })
    }
    
    static getTextData(url, postData, credentials = false) {
        return this.fetch(url, postData, credentials)
            .then(this.httpStatus)
            .then((response) => response.text())
            .catch((message) => {
                console.log("Failed to fetch " + url + " - " + message)
            })
    }
    
    static getJSONData(url, postData, credentials = false) {
        return this.fetch(url, postData, credentials)
            .then(this.httpStatus)
            .then((response) => response.text())
            .then(text => {
                try {
                    return JSON.parse(text)
                } catch (e) {
                    console.log("wrong response: \n" + text)
                    throw e
                }
            })
            .catch((message) => {
                console.log("Failed to fetch " + url + " - " + message)
                return {
                    success: false,
                    error: message,
                }
            })
    }
    
    
}
