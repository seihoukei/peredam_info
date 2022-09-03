import library from "stores/library.js"

import Messages from "utility/messages.js"
import Web from "utility/web.js"
import Values from "utility/values.js"

let apiServer = "https://dev-api.peredam.info/"
let publicPushKey = "BA2iyEu6lro5moczY3kEBtSWIFu4fmT9ZQw57Z727FOhbt8hqPE-HmVcB2Gz9SD4iecmYnhzX6C1Khc2hHRu1-Y"

if (import.meta.env.MODE === "development") {
    apiServer = "http://localhost:5174/"
}

if (new URL(window.location).origin === "https://peredam.info") {
    publicPushKey = "BFYrwDah-OiZGlLyu2tJNBABd8P5gvlZ8_Ey1e3KIyk3ndzEv0dd_wFReQS4xAjG27LzclCOhEs7qFd93U0KN9Y"
    apiServer = "https://api.peredam.info/"
}

export default class Api {
    static server = apiServer
    static library = `${apiServer}library/library.json`
    static forceManualMethod = false // apiServer === "https://api.peredam.info/"
    static publicPushKey = publicPushKey
    
    static #apiUrl(address) {
        return `${this.server}${address}`
    }
    
    static async #call(api, data) {
        const result = await Web.getJSONData(this.#apiUrl(api), data, true)
        
        if (import.meta.env.MODE === "development" || !result?.success) {
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
    
    static async getUserData(token = null) {
        if (!token) {
            return Messages.failure()
        }
        
        const result = await this.#call("user/data", {
            token,
        })
        
        if (result.success) {
            try {
                return Messages.success({
                    systems : result.data.systems.map(record => ({
                        id: +record.id,
                        provider_id: +record.provider_id,
                        values: JSON.parse(record.values),
                        last: record.last_values ? {
                            date: record.last_date * 1000,
                            sent: (record.last_sent * 1000) || null,
                            values: JSON.parse(record.last_values),
                            type : record.last_type,
                            replied: (record.last_replied * 1000) || null,
                            reply: record.last_reply || null
                        } : null,
                    })),
                    properties: {
                        email: result.data.properties.email || {
                            address : "",
                            confirmed : true,
                        },
                    },
                })
                
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
    
    static async setEmail(token, address) {
        return await this.#call("email/set", {
            token, address
        })
    }
    
    static async setEmailSettings(token, settings) {
        return await this.#call("email/update_settings", {
            token, settings
        })
    }
    
    static async confirmEmail(token, code) {
        return await this.#call("email/confirm", {
            token, code
        })
    }
    
    static async registerPushSubscription(token, subscription) {
        return await this.#call("push/subscribe", {
            token, subscription
        })
    }

    static async unregisterPushSubscription(token, subscription) {
        return await this.#call("push/unsubscribe", {
            token, subscription
        })
    }
}
