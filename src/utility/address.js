export default class Address {
    static URL_PATTERNS = {
        user: `system_id/mode/data`,
        add: `subpage/data`,
        anon: `subpage/data`,
    }
    
    static getPart(n = 0, ...conditionalParts) {
        const parts = new URL(window.location).search.slice(1).split("/")
        if (conditionalParts.some((part, index) => part !== parts[index])) {
            return null
        }
        return parts[n]
    }
    
    static #makeURL(state) {
        const url = new URL(window.location)
        
        if (state.page) {
            url.search = `?${state.page}`
        } else {
            url.search = ``
        }
        
        const pattern = this.URL_PATTERNS[state.page]
        if (pattern) {
            const items = pattern.split("/")
            
            for (let item of items) {
                if (item === "subpage") {
                    if (state.system_id) {
                        url.search += `/sys/${state.system_id}`
                    } else if (state.provider_id) {
                        url.search += `/prov/${state.provider_id}`
                    } else if (state.city_id) {
                        url.search += `/city/${state.city_id}`
                    } else {
                        break
                    }
                } else {
                    if (state[item] === null || state[item] === ``) {
                        break
                    }
                    url.search += `/${state[item]}`
                }
            }
        }
        
        return url.href
    }
    
    static set(state, replace = false) {
        const path = this.#makeURL(state)
        
        if (replace) {
            window.history.replaceState(state, null, path)
        } else {
            window.history.pushState(state, null, path)
        }
    }
    
    static getRelevantHelpPage(appState, loginState = null) {
        let page = ``
        
        if (loginState) {
            page = `${page}/login/${loginState.stage}`
            
            if (loginState.isNewUser && loginState.stage !== `code`)
                page = `${page}/new`

            if (loginState.stage === `code` && loginState.tokens.current)
                page = `${page}/set`
        
        } else {
            page = `${page}/${appState.page}`
            
            if (appState.system_id)
                page = `${page}/sys`
            else if (appState.provider_id)
                page = `${page}/prov`
            else if (appState.city_id)
                page = `${page}/city`
            
            if (appState.mode)
                page = `${page}/${appState.mode}`
        }
        return page
    }
}
