import library from "stores/library.js"

import Messages from "utility/messages.js"
import Web from "utility/web.js"
import Values from "utility/values.js"

let apiServer = "https://dev-api.peredam.info/"

if (import.meta.env.MODE === "development") {
    apiServer = "http://localhost:5174/"
}

if (new URL(window.location).origin === "https://peredam.info") {
    apiServer = "https://api.peredam.info/"
}

export default class Api {
    static server = apiServer
    static library = `${apiServer}library/library.json`
    static forceManualMethod = apiServer === "https://api.peredam.info/"
    
    static #apiUrl(address) {
        return `${this.server}${address}`
    }
    
    static async #call(api, data) {
        const result = await Web.getJSONData(this.#apiUrl(api), data, true)
        
        if (import.meta.env.MODE === "development") {
            console.log(api, data, {...result})
        }
        
        if (result?.success !== true) {
            return Messages.failure(result?.error ?? "Неизвестная ошибка")
        }
        
        return result
    }
    
    static async #get(api) {
        const result = await Web.getJSONData(this.#apiUrl(api))
        
        if (result.error) {
            return Messages.failure(result?.error ?? "Неизвестная ошибка")
        }
        
        return Messages.success(result)
    }
    
    static async #fakeFetch(delay) {
        await new Promise((resolve) => {
            setTimeout(resolve, delay)
        })
        return Math.random()
    }
    
    static async getLibrary() {
        return await this.#get("library/library.json")
    }
    
    static async loginExists(login) {
        return await this.#call("auth/login_exists", {
            login,
        })
    }
    
    static async logIn(login, password) {
        return await this.#call("auth/login", {
            login, password,
        })
    }
    
    static async register(login, password) {
        return await this.#call("auth/register", {
            login, password,
        })
    }
    
    static async getUserSystems(token = null) {
        if (!token) {
            return Messages.failure()
        }
        
        const result = await this.#call("systems/list", {
            token,
        })
        
        if (result.success) {
            try {
                result.data = result.data.map(record => ({
                    id: +record.id,
                    provider_id: +record.provider_id,
                    values: JSON.parse(record.values),
                    last: record.last_values ? {
                        date: record.last_date * 1000,
                        values: JSON.parse(record.last_values),
                    } : null,
                }))
            } catch (e) {
                return Messages.failure("Неизвестная ошибка")
            }
        }
        
        return result
    }
    
    static async getProviderRecords(token, page = 0) {
        if (!token) {
            return Messages.failure()
        }
        
        const result = await this.#call("read/list", {
            token,
            page,
        })
        
        if (result.success) {
            try {
                const template = library.providers[result.data.provider_id].providerData.viewTemplate
                result.data.records = result.data.records.map(record => ({
                    date: record.date,
                    type: record.type,
                    record: Values.fillTemplate(template, JSON.parse(record.values)),
                }))
            } catch (e) {
                return Messages.failure("Неизвестная ошибка")
            }
        }
        return result
    }
    
    static async addSystem(token, system) {
        if (!token) {
            return Messages.failure()
        }
        
        return await this.#call("systems/add", {
            token,
            system: {
                provider_id: system.provider_id,
                values: JSON.stringify(system.values),
            },
        })
    }
    
    static async updateSystem(token, id, values) {
        if (!token) {
            return Messages.failure()
        }
        
        return await this.#call("systems/update", {
            token,
            system: {
                id,
                values: JSON.stringify(values),
            },
        })
    }
    
    static async removeSystem(token, id) {
        if (!token) {
            return Messages.failure()
        }
        
        return await this.#call("systems/remove", {
            token, id,
        })
    }
    
    static async submitUserValues(token, system, values, queue = false) {
        return await this.#call("submit/user", {
            token,
            system_id: system.id,
            provider_id: system.provider_id,
            values: JSON.stringify(values),
            queue,
        })
    }
    
    static async submitAnonymousValues(provider_id, values, queue = false) {
        return await this.#call("submit/anon", {
            provider_id,
            values: JSON.stringify(values),
            queue,
        })
    }
}
