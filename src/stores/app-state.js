import {writable} from "svelte/store"
import Address from "../utility/address.js"
import library from "./library.js"

const DEFAULT_STATE = {
    page : "",
    city_id : null,
    provider_id : null,
    system_id : null,
    user_provider_id : null,
    user_name : "",
    mode : ``,
    data : ``,
    token : ``
}

const {set, update, subscribe} = writable({...DEFAULT_STATE})

const appState = {
    UPDATE_ADDRESS : {
        NO : 0,
        PUSH : 1,
        REPLACE : 2,
    },
    
    subscribe, update, set,
    
    setValue(key, value, updateAddress = appState.UPDATE_ADDRESS.PUSH) {
        update(state => {
            state[key] = value
            
            if (updateAddress !== appState.UPDATE_ADDRESS.NO)
                Address.set(state, updateAddress === appState.UPDATE_ADDRESS.REPLACE)
            
            return state
        })
    },

    setPage(value = "", updateAddress = appState.UPDATE_ADDRESS.PUSH) {
        this.setCityId(null, appState.UPDATE_ADDRESS.NO)
        this.setSystemId(null, appState.UPDATE_ADDRESS.NO)
        this.setMode(``, appState.UPDATE_ADDRESS.NO)

        this.setValue('page', value, updateAddress)
    },
    
    setSystemId(value = null, updateAddress = appState.UPDATE_ADDRESS.PUSH) {
        this.setMode(``, appState.UPDATE_ADDRESS.NO)

        this.setValue('system_id', value?.id ?? value, updateAddress)
    },

    setCityId(value = null, updateAddress = appState.UPDATE_ADDRESS.PUSH) {
        this.setProviderId(null, appState.UPDATE_ADDRESS.NO)
        this.setMode(``, appState.UPDATE_ADDRESS.NO)

        const newValue = value?.id ?? value
        this.setValue('city_id', newValue, updateAddress)
        if (newValue !== null)
            localStorage.defaultCity = newValue
    },

    setProviderId(value = null, updateAddress = appState.UPDATE_ADDRESS.PUSH) {
        this.setMode(``, appState.UPDATE_ADDRESS.NO)
    
        const newValue = value?.id ?? value

        if (newValue !== null && library?.providers?.[newValue])
            this.setCityId(+library.providers[newValue].city_id, appState.UPDATE_ADDRESS.NO)

        this.setValue('provider_id', newValue, updateAddress)

    },

    setMode(value = '', updateAddress = appState.UPDATE_ADDRESS.PUSH) {
        this.setData(``, appState.UPDATE_ADDRESS.NO)
        this.setValue('mode', value, updateAddress)
    },

    setData(value = '', updateAddress = appState.UPDATE_ADDRESS.REPLACE) {
        this.setValue('data', value, updateAddress)
    },
    
    setToken(value = '') {
        this.setValue('token', value, appState.UPDATE_ADDRESS.NO)
    },
    
    setUserProviderId(value = null) {
        this.setValue('user_provider_id', value, appState.UPDATE_ADDRESS.NO)
        if (value)
            localStorage.provider_id = value
        else
            delete localStorage.provider_id
    },
    
    reset(updateAddress = appState.UPDATE_ADDRESS.PUSH) {
        this.set({...DEFAULT_STATE})
        if (updateAddress !== appState.UPDATE_ADDRESS.NO)
            Address.set(DEFAULT_STATE)

    },
    
    restorePage() {
        this.reset(appState.UPDATE_ADDRESS.NO)
        
        this.setPage(Address.getPart(0), appState.UPDATE_ADDRESS.NO)
        
        this.setValue('user_name', localStorage.login ?? "", appState.UPDATE_ADDRESS.NO)
        this.setValue('user_provider_id', localStorage.provider_id ?? null, appState.UPDATE_ADDRESS.NO)

    },
    
    restorePageData(page = "") {
        const pattern = Address.URL_PATTERNS[page]
        if (!pattern)
            return
        
        const items = pattern.split("/")
        let shift = 1
        
        items.forEach((item,index) => {
            const value = Address.getPart(index + shift)
            switch (item) {
                case 'subpage':
                    shift++
                    const id = Address.getPart(index + shift)
                    switch (value) {
                        case 'sys':
                            this.setSystemId(+id || null, appState.UPDATE_ADDRESS.NO)
                            break
                        case 'city':
                            this.setCityId(+id || null, appState.UPDATE_ADDRESS.NO)
                            break
                        case 'prov':
                            this.setProviderId(+id || null, appState.UPDATE_ADDRESS.NO)
                            break
                    }
                    break;
                case 'system_id':
                    this.setSystemId(+value || null, appState.UPDATE_ADDRESS.NO)
                    break
                case 'city_id':
                    this.setCityId(+value || null, appState.UPDATE_ADDRESS.NO)
                    break
                case 'provider_id':
                    this.setProviderId(+value || null, appState.UPDATE_ADDRESS.NO)
                    break
                case 'mode':
                    this.setMode(value || "", appState.UPDATE_ADDRESS.NO)
                    break
                case 'data':
                    this.setData(value || "", appState.UPDATE_ADDRESS.NO)
                    break
                default:
                    this.setValue(item, value || null, appState.UPDATE_ADDRESS.NO)
            }
        })
    },
    
}

export default appState
