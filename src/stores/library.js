import {writable} from "svelte/store"
import Api from "../utility/api.js"
import modal from "./modal.js"
import Serializer from "../utility/serializer.js"

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
            library.cities[provider.city_id].providers[id] = provider
        }
        
        localStorage.library = Serializer.serialize(library)
        libraryReady.set(true)
    } else if (localStorage.library) {
        library = Serializer.deserialize(localStorage.library)
        libraryReady.set(true)
    } else {
        modal.error("Не удалось загрузить основную базу. Попробуйте позже.")
    }
})
