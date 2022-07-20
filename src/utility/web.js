export default class Web {
	
	static httpStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return Promise.resolve(response)
		} else {
			return Promise.reject(response.statusText)
		}
	}

	static fetch(url, postData) {
		if (postData === undefined)
			return fetch(url)
		
		return fetch(url, {
			method : "POST",
			body : JSON.stringify(postData),
		})
	}
	
	static getTextData(url, postData) {
		return this.fetch(url, postData)
			.then(this.httpStatus)
			.then((response) => response.text())
			.catch((message) => {
				console.log("Failed to fetch " + url + " - " + message)
			})
	}
	
	static getJSONData(url, postData) {
		return this.fetch(url, postData)
			.then(this.httpStatus)
			.then((response) => response.text())
			.then(text => {
				try {
					return JSON.parse(text)
				} catch (e) {
					console.log("wrong response: \n" + text)
					throw e;
				}
			})
			.catch((message) => {
				console.log("Failed to fetch " + url + " - " + message)
				return {
					success : false,
					error : message,
				}
			})
	}
	
	
}
