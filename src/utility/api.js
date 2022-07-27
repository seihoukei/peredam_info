import {failure, success} from "./messages.js"
import Web from "./web.js"
import fillTemplate from "./template.js"
import library from "../stores/library.js"

export default class Api {
    static server = "https://api.peredam.info/"
//    static server = "http://localhost:5174/"
    static library = `${this.server}library/library.json`
    
    static #apiUrl (address) {
        return `${this.server}${address}`
    }
    
    static async #call(api, data) {
        const result = await Web.getJSONData(this.#apiUrl(api), data, true)

        console.log(result)
        if (result?.success !== true) {
            return failure(result?.error ?? "Неизвестная ошибка")
        }

        return result
    }
    
    static async #get(api) {
        const result = await Web.getJSONData(this.#apiUrl(api))

        if (result.error) {
            return failure(result?.error ?? "Неизвестная ошибка")
        }

        return success(result)
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
            login
        })
    }
    
    static async logIn(login, password) {
        return await this.#call("auth/login", {
            login, password
        })
    }
    
    static async register(login, password) {
        return await this.#call("auth/register", {
            login, password
        })
    }
    
    static async getUserSystems(token = null) {
        if (!token)
            return failure()
        
        const result = await this.#call("systems/list", {
            token
        })
        
        if (result.success) {
            try {
                result.data = result.data.map(record => ({
                    id: +record.id,
                    provider_id: +record.provider_id,
                    values: JSON.parse(record.values),
                    last : record.last_values ? {
                        date : record.last_date * 1000,
                        values : JSON.parse(record.last_values),
                    } : null
                }))
            } catch (e) {
                return failure("Неизвестная ошибка")
            }
        }

        return result
    }
    
    static async getProviderRecords(token, page = 0) {
        if (!token)
            return failure()
    
        const result = await this.#call("provider/list", {
            token,
            page
        })
    
        if (result.success) {
            try {
                const template = library.providers[result.data.provider_id].providerData.viewTemplate
                result.data.records = result.data.records.map(record => ({
                    date: record.date,
                    status : record.status,
                    record: fillTemplate(template, JSON.parse(record.values)),
                }))
            } catch (e) {
                return failure("Неизвестная ошибка")
            }
        }
        return result
    }

    static async addSystem(token, system) {
        if (!token)
            return failure()
    
        return await this.#call("systems/add", {
            token,
            system : {
                provider_id : system.provider_id,
                values : JSON.stringify(system.values)
            }
        })
    }
    
    static async updateSystem(token, id, values) {
        if (!token)
            return failure()
    
        return await this.#call("systems/update", {
            token,
            system : {
                id,
                values : JSON.stringify(values)
            }
        })
    }
    
    static async removeSystem(token, id) {
        if (!token)
            return failure()
    
        return await this.#call("systems/remove", {
            token, id
        })
    }
    
    static async submitUserValues(token, system, values, queue = false) {
        return await this.#call("submit/user", {
            token,
            system_id : system.id,
            provider_id : system.provider_id,
            values : JSON.stringify(values),
            queue
        })
    }
    
    static async submitAnonymousValues(provider_id, values, queue = false) {
        return await this.#call("submit/anonymous", {
            provider_id,
            values : JSON.stringify(values),
            queue
        })
    }
}
