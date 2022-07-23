import {failure, success} from "./messages.js"
import Web from "./web.js"

export default class Api {
//    static server = "https://api.peredam.info/"
    static server = "http://localhost:5174/"
    
    static #apiUrl (address) {
        return `${this.server}${address}`
    }
    
    static async #call(api, data) {
        return Web.getJSONData(this.#apiUrl(api), data)
    }
    
    static async fakeFetch(delay) {
        await new Promise((resolve) => {
            setTimeout(resolve, delay)
        })
        return Math.random()
    }
    
    static async checkLogin(login) {
        const result = await this.#call("auth/check_login", {
            login
        })
        
        if (result?.success !== true) {
            return failure(result?.error ?? "Неизвестная ошибка")
        }
        
        if (result.data.taken) {
            return failure("Логин занят")
        }
        
        if (result.data.invalid) {
            return failure("Некорректный логин")
        }
        
        return success("Допустимый логин")
    }
    
    static async logIn(login, password) {
        const result = await this.#call("auth/login", {
            login
        })
    
        if (result?.success !== true) {
            return failure(result?.error ?? "Неизвестная ошибка")
        }
        
        return result
    }
    
    static async register(login, password) {
        const result = await this.#call("auth/register", {
            login, password
        })
    
        if (result?.success !== true) {
            return failure(result?.error ?? "Неизвестная ошибка")
        }
    
        return result
    }
    
    static async getUserData(token = null) {
        if (!token)
            return failure()
        
        return await this.#call("user/systems", {
            token
        })
    }
    
    static async saveUserData(token, data) {
        if (!token)
            return failure()
        
        return await this.#call("user/systems", {
            token,
            data
        })
    }
    
    static async submitData(data) {
        return await this.#call("user/submit", {
//            token,
            data
        })
    }
}
