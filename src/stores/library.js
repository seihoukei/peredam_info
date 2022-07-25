import {writable} from "svelte/store"
import Web from "../utility/web.js"
import Api from "../utility/api.js"

let library = {
    cities : {},
    providers : {},
}

export default library
export const libraryReady = writable(false)

export const loadLibrary = Api.getLibrary().then(result => {
    if (result.success) {
        Object.assign(library, result.data)
        
        for (let [id, city] of Object.entries(library.cities)) {
            city.providers = {}
        }
        
        for (let [id, provider] of Object.entries(library.providers)) {
            library.cities[provider.city].providers[id] = provider
        }
        libraryReady.set(true)
    }
})
