import {failure, success} from "./messages.js"
import Web from "./web.js"

export default class Api {
//    static server = "https://api.peredam.info/"
    static server = "/_api/"
    
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
        await this.fakeFetch(300)
        
/*
        console.log(await this.#call("auth/check_login", {
            login
        }))
        
*/
        if (login.slice(0,1) !== "1")
            return failure("Логин занят")
    
        return success("Допустимый логин")
    }
    
    static async logIn(login, password) {
        await this.fakeFetch(1000)
        
        if (login !== password)
            return failure("Логин и пароль должны совпадать (тестовый режим)")
    
        return success({
            token : `login(${login}.${password})`
        })
    }
    
    static async register(login, password) {
        await this.fakeFetch(1000)
        
        if (login === password)
            return failure("Логин и пароль не должны совпадать (тестовый режим)")
        
        return success({
            token : `register(${login}.${password})`
        })
    }
    
    static async getUserData(token = null) {
        if (!token)
            return failure()
        
        await this.fakeFetch(1000)
    
        const name = token.split("(")[1].split(".")[0].split``.reverse().join``
        
        return success({
            name,
        })
    }
}
