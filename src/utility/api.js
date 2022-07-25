import {failure, success} from "./messages.js"
import Web from "./web.js"

export default class Api {
//    static server = "https://api.peredam.info/"
    static server = "http://localhost:5174/"
    
    static #apiUrl (address) {
        return `${this.server}${address}`
    }
    
    static async #call(api, data) {
        const result = await Web.getJSONData(this.#apiUrl(api), data)

        console.log(result)
        if (result?.success !== true) {
            return failure(result?.error ?? "Неизвестная ошибка")
        }

        return result
    }
    
    static async #fakeFetch(delay) {
        await new Promise((resolve) => {
            setTimeout(resolve, delay)
        })
        return Math.random()
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
                    provider: +record.provider,
                    values: JSON.parse(record.values),
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
                provider : system.provider,
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
    
    static async submitUserData(token, system, data) {
        return await this.#call("submit/user", {
            token,
            system,
            data
        })
    }
    
    static async submitAnonymousData(provider, data) {
        return await this.#call("submit/anonymous", {
            provider,
            data
        })
    }
}
